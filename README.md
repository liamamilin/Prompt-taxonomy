# Prompt Taxonomy · 提示词图谱

按任务查找、填写、复制和分享 Prompt 的公开目录。当前覆盖 **12 类任务、120 条中文模板**。目录以 **17 个国际 GitHub 仓库**为主样本，总计参考 **33 个来源**，包括跨国调查、使用日志和官方案例。

- [在线模板库](https://liamamilin.github.io/Prompt-taxonomy/)
- [调研报告、GitHub 样本与统计口径](RESEARCH.md)
- [下载机器可读目录](docs/catalog.json)

分类为查找与研究、写作与语言、学习与辅导、计划与生活、办公与协作、数据与表格、开发与调试、创作与多媒体、求职与职业、产品与业务、沟通与协商、提示词与 AI 工作流。模板里的 `【变量】` 可替换为自己的材料。证据类型说明同类任务有公开使用研究、可查案例，或由本项目补足。

页面发布自 `main` 的 `/docs` 目录。本地预览使用 `python3 -m http.server 8765 --directory docs`。修改 [模板](scripts/catalog.txt) 或 [来源](scripts/sources.txt) 后运行 `python3 scripts/build_catalog.py`，同步提交生成的 JSON。
