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

output = dict(version="2.1", researchedOn="2026-11-19", categories=categories, evidence=evidence,
              sources=sources, prompts=prompts, workflows=workflows)


def translations(filename, fields):
    """Read translations keyed by the same IDs as the primary catalog."""
    rows = {}
    for line in (root / filename).read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        key, *values = line.split("|", fields)
        if len(values) != fields or key in rows or not all(value.strip() for value in values):
            raise ValueError(f"Invalid translation in {filename}: {key}")
        rows[key] = values
    return rows


english = translations("catalog.en.txt", 3)
english_categories = translations("categories.en.txt", 2)
english_workflows = translations("workflows.en.txt", 2)
english_sources = translations("sources.en.txt", 1)
for kind, actual, expected in (
    ("prompts", english.keys(), ids),
    ("categories", english_categories.keys(), category_ids),
    ("workflows", english_workflows.keys(), workflow_ids),
    ("sources", english_sources.keys(), sources.keys()),
):
    if actual != expected:
        raise ValueError(f"Unmatched English {kind}. Missing: {expected - actual}. Unexpected: {actual - expected}")

kind_labels = {
    "日志研究": "Usage study",
    "跨国调查": "Cross-country survey",
    "人群调查": "Population survey",
    "公开语料研究": "Public corpus study",
    "GitHub 仓库": "GitHub repository",
    "官方案例": "Official examples",
}
english_prompts = []
for prompt in prompts:
    title, description, template = english[prompt["id"]]
    variables = list(dict.fromkeys(re.findall("【([^】]+)】", template)))
    # The site retains user input in this order when switching languages.
    if len(variables) != len(prompt["variables"]):
        raise ValueError(f"Variable count differs in English prompt: {prompt['id']}")
    tags = [tag for tag in prompt["tags"] if not re.search(r"[\u3400-\u9fff]", tag)]
    english_prompts.append(dict(prompt, title=title, description=description,
                                template=template, variables=variables, tags=tags))

english_output = dict(
    output,
    categories=[dict(cat, name=english_categories[cat["id"]][0],
                     description=english_categories[cat["id"]][1]) for cat in categories],
    evidence={
        "usage": {"label": "Usage research", "description": "Published usage data or surveys record similar tasks."},
        "example": {"label": "Public examples", "description": "Related examples appear in public repositories or official guides."},
        "editorial": {"label": "Editorial addition", "description": "An original template that fills a gap in a workflow."},
    },
    sources={key: dict(source, name=source["name"].replace("Kiran 等", "Kiran et al."),
                       kind=kind_labels[source["kind"]], note=english_sources[key][0]) for key, source in sources.items()},
    prompts=english_prompts,
    workflows=[dict(flow, title=english_workflows[flow["id"]][0],
                    description=english_workflows[flow["id"]][1]) for flow in workflows],
)

for filename, data in (("catalog.json", output), ("catalog.en.json", english_output)):
    (root.parent / "docs" / filename).write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
print(f"{len(prompts)} prompts, {len(categories)} categories, {len(workflows)} workflows, {len(sources)} sources")
