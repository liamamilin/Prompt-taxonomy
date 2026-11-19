#!/usr/bin/env python3
"""Build the public catalog from the editable template and source lists."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent
categories, prompts, sources, workflows = [], [], {}, []
evidence = {
    "usage": {"label": "使用研究", "description": "公开日志或调查记录了同类任务。"},
    "example": {"label": "公开案例", "description": "可在公开仓库或官方指南查到相似用法。"},
    "editorial": {"label": "编辑补充", "description": "为补足工作流整理的原创模板。"},
}

for line in (root / "sources.txt").read_text().splitlines():
    if line.strip():
        key, name, kind, url, note = line.split("|", 4)
        if key in sources or not url.startswith("https://"):
            raise ValueError(f"Invalid source: {key}")
        sources[key] = dict(name=name, kind=kind, url=url, note=note)
usage_kinds = {"日志研究", "跨国调查", "人群调查", "公开语料研究"}
ids, category_ids, titles = set(), set(), set()
for line in (root / "catalog.txt").read_text().splitlines():
    if not line.strip():
        continue
    if line.startswith("# "):
        category, name, description = line[2:].split("|", 2)
        if category in category_ids:
            raise ValueError(f"Duplicate category: {category}")
        category_ids.add(category)
        categories.append(dict(id=category, name=name, description=description))
        continue
    key, title, description, tags, basis, references, template = line.split("|", 6)
    references = references.split(",")
    variables = list(dict.fromkeys(re.findall("【([^】]+)】", template)))
    if key in ids or title in titles or basis not in evidence or not variables:
        raise ValueError(f"Invalid prompt: {key}")
    if basis == "usage" and not any(sources[s]["kind"] in usage_kinds for s in references):
        raise ValueError(f"Missing usage evidence: {key}")
    for source in references:
        if source not in sources:
            raise ValueError(f"Unrecognized source {source} for {key}")
    ids.add(key)
    titles.add(title)
    prompts.append(dict(id=key, category=category, title=title, description=description,
                        tags=tags.split(","), evidence=basis, sources=references,
                        variables=variables, template=template))

workflow_ids, covered_categories = set(), set()
prompts_by_id = {prompt["id"]: prompt for prompt in prompts}
for line in (root / "workflows.txt").read_text().splitlines():
    if not line.strip() or line.startswith("# "):
        continue
    key, title, description, references, steps = line.split("|", 4)
    references = references.split(",")
    steps = steps.split(",")
    if key in workflow_ids or len(set(steps)) < 2 or len(set(steps)) != len(steps):
        raise ValueError(f"Invalid workflow: {key}")
    if not set(references) <= sources.keys() or not set(steps) <= ids:
        raise ValueError(f"Unrecognized source or prompt in workflow: {key}")
    workflow_ids.add(key)
    covered_categories.update(prompts_by_id[step]["category"] for step in steps)
    workflows.append(dict(id=key, title=title, description=description, sources=references, steps=steps))

if covered_categories != category_ids:
    raise ValueError(f"Categories without a workflow: {category_ids - covered_categories}")

output = dict(version="2.0", researchedOn="2026-11-19", categories=categories, evidence=evidence,
              sources=sources, prompts=prompts, workflows=workflows)
(root.parent / "docs" / "catalog.json").write_text(
    json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"{len(prompts)} prompts, {len(categories)} categories, {len(workflows)} workflows, {len(sources)} sources")
