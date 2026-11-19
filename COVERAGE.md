# 常用 Prompt 覆盖审查 · V2.0

本次以 V1.1 的 120 条为基线，逐类检查用户在开始、处理材料、验证和交付时能不能找到合适的模板。V2.0 有 **224 条模板、16 类任务、19 条工作流**，原有条目的 ID 和正文保持一致。调研底稿和来源边界见 [RESEARCH.md](RESEARCH.md)，标准数据见 [目录 JSON](docs/catalog.json)。

## 怎么判定一项任务应当纳入

- **广泛可见的任务**优先覆盖。例如查资料、指导、编辑改写和教学在公开使用数据中反复出现。先确保普通用户可以用日常词搜到，再补有独立交付物的后续步骤。
- **有具体工作流的任务**按实际使用场景纳入。例如 PDF 表格跨页提取和客服交接有可检查的输入与输出。专题库提供用例，使用量仍未知。
- **容易断在交付前的步骤**可以编辑补充。例如文件清单、就诊前整理材料和面试复盘，都有明确的下一步。条目标为编辑补充或公开案例，依据可以追溯。
- **一个条目对应一个主要用途。** 换模型、语气、行业名或提示技巧不足以成为新条目。用户可填写变量，或用同一模板处理类似输入。不同交付物可以独立收录，例如找学员的误解和编排一份教案。

首版把多项文件交付、语言练习、对客销售和服务运营混在较宽的类目中。本版把它们独立出来。文字翻译仍可从写作找到，软件字符串与双语审查放在语言类；通用投诉沟通与服务台的分流和结案通过工作流连接。

## 任务覆盖矩阵

下表的「搜索词」是能够代表真实查找意图的验收样例。样例交付物对应一条可直接打开的模板。

| 主类 | 常用入口 | 处理与验收覆盖 | 搜索词与可用产物 |
| --- | --- | --- | --- |
| 查找与研究 | 事实问答、主题调研、推荐 | 问题限定、原始出处、分歧、证据矩阵、对外简报 | `证据图谱` → [主张与证据对照表](https://liamamilin.github.io/Prompt-taxonomy/#prompt=evidence-map) |
| 写作与语言 | 邮件、改写、翻译、总结、起草 | 编辑可追溯、长度约束、标题、跨渠道复用 | `逐句润色` → [带修改理由的清稿](https://liamamilin.github.io/Prompt-taxonomy/#prompt=line-edit-markup) |
| 学习与辅导 | 讲解、解题提示、学习计划 | 例题、闭卷回忆、错题模式、迁移检测 | `错题本` → [错误模式与针对性练习](https://liamamilin.github.io/Prompt-taxonomy/#prompt=review-mistakes) |
| 计划与生活 | 如何做、购物、行程、餐食 | 预算和硬条件、替代方案、活动安排、自我反思 | `食谱换算` → [改后用量和完成判断](https://liamamilin.github.io/Prompt-taxonomy/#prompt=recipe-scale) |
| 办公与协作 | 会议、汇报、演示、交接 | 议程、决策、异步同步、流程复盘和验收 | `干系人` → [职责与沟通安排](https://liamamilin.github.io/Prompt-taxonomy/#prompt=stakeholder-map) |
| 数据与表格 | 字段提取、公式、SQL、图表 | 清洗、口径、对账、漏斗、分群留存和异常排查 | `分群留存` → [经窗口与去重核验的留存表](https://liamamilin.github.io/Prompt-taxonomy/#prompt=cohort-retention) |
| 开发与调试 | 读代码、复现、修复、测试 | PR、迁移、CI、可访问性和发布检查 | `CI 失败` → [首个有效错误与验证命令](https://liamamilin.github.io/Prompt-taxonomy/#prompt=ci-failure) |
| 创作与多媒体 | 图片、故事、图像编辑、视频 | 画面一致性、镜头表、剪辑、字幕、旁白和声音 | `剪辑` → [按时码和素材拆出的剪辑表](https://liamamilin.github.io/Prompt-taxonomy/#prompt=video-edit-plan) |
| 求职与职业 | 岗位拆解、简历、求职信和面试 | 真实经历证据、能力缺口、作品集、机会对比 | `简历要点` → [有事实支撑的经历条目](https://liamamilin.github.io/Prompt-taxonomy/#prompt=resume-bullets) |
| 产品与业务 | 访谈、需求、用户故事、优先级 | 机会、MVP、旅程、实验和可用性测试 | `用户访谈` → [含事实追问的访谈提纲](https://liamamilin.github.io/Prompt-taxonomy/#prompt=discovery-interview) |
| 沟通与协商 | 反馈、跟进、难开口的对话 | 角色观点、澄清问题、升级说明和行动确认 | `困难对话` → [开场与模拟回应](https://liamamilin.github.io/Prompt-taxonomy/#prompt=difficult-conversation) |
| 提示词与 AI 工作流 | 修复提示词、定义输出、挑示例 | 回归样本、评测、工具选择、批处理和人工检查 | `回归样本` → [可检查的 Prompt 回归集](https://liamamilin.github.io/Prompt-taxonomy/#prompt=design-regression-set) |
| 文档与文件 | PDF、扫描件、Office 文件、资料包 | 跨页表格、OCR、修订、元数据及交付复核 | `PDF 表格` → [带页码和合计核对的表格](https://liamamilin.github.io/Prompt-taxonomy/#prompt=table-from-pdf) |
| 语言练习与本地化 | 语言等级、语法、词汇和口语 | 听读练习、UI 占位符、术语表和双语校对 | `i18n` → [保留变量和键名的界面译文](https://liamamilin.github.io/Prompt-taxonomy/#prompt=localize-ui) |
| 营销与销售 | 受众定位、渠道内容、广告和销售准备 | 落地页、异议、方案、活动归因与复盘 | `落地页` → [从承诺到行动的内容结构](https://liamamilin.github.io/Prompt-taxonomy/#prompt=landing-page-outline) |
| 客服与服务运营 | 工单分类、首响、排查和转单 | 状态更新、结案、知识库、服务质检和积压报告 | `客服升级` → [有复现和已试动作的交接](https://liamamilin.github.io/Prompt-taxonomy/#prompt=support-escalation) |

## 用工作流检查分类能不能接起来

[网页工作流](https://liamamilin.github.io/Prompt-taxonomy/#workflows)把模板按顺序连起来，允许从任一步开始。每条工作流列出可检查的中间产物，覆盖全部 16 类。研究报告的验收路径是从问题和检索计划进入证据表，核对分歧，然后交付简报。客服工单则沿分类、首响、排障、转单、结案与知识库进行，转单只在需要时使用。工作流的步骤、来源和模板 ID 也保存在 [目录 JSON](docs/catalog.json) 中。

本次对新旧模板兼容性、来源和工作流引用完整性、以及代表查询和交互做了核验。**完备是当前任务范围内的覆盖结论。** 公开数据按平台、地区、入口和受众划分，对单条 Prompt 的全球频率缺少可比数据；新增模板也未做逐条跨模型效果实验。后续扩充可优先使用实际找不到的任务、搜索词或失败样例。
