# Prompt Taxonomy · 提示词图谱

按任务查找、填写、复制和分享 Prompt 的公开目录。V2.0 覆盖 **16 类任务、224 条中文模板、19 条工作流**。以 **28 个国际 GitHub 仓库**为主样本，参考 **49 个来源**，包括跨国调查、平台日志、公开语料和官方案例。

- [浏览和搜索模板](https://liamamilin.github.io/Prompt-taxonomy/#library)
- [按工作流使用](https://liamamilin.github.io/Prompt-taxonomy/#workflows)
- [任务覆盖审查](COVERAGE.md)
- [调研、GitHub 样本与各数据分母](RESEARCH.md)
- [下载机器可读目录](https://liamamilin.github.io/Prompt-taxonomy/catalog.json)

模板里的 `【变量】` 可替换为自己的材料。条目的证据标签描述同类任务的公开使用研究、公开案例或编辑补充。工作流给出可依次复制的模板，适合把上一步的结果作为下一步的输入。

页面发布自 `main` 的 `/docs`。本地预览运行 `python3 -m http.server 8765 --directory docs`。改动 [模板](scripts/catalog.txt)、[来源](scripts/sources.txt) 或 [工作流](scripts/workflows.txt) 后运行 `python3 scripts/build_catalog.py`，同步提交生成的 JSON。模板 ID 会出现在分享链接中，修改时应保留已有 ID。
