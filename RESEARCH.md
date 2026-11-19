# Prompt Taxonomy 调研

调研截至 2026 年 11 月 19 日。本项目主要考察国际 GitHub 上公开的 Prompt、工作流与 Cookbook，再用国际调查和真实会话研究核对使用信号。产物是可复用的任务目录。48 条模板为原创整理。

## 结论

1. **查资料、问具体问题、拿到可执行建议，应放在最容易找到的位置。** 牛津 Reuters Institute 2026 年在线调查覆盖 9 个国家。可跨年比较的 6 国中，过去一周用生成式 AI 获取信息的比例从 2024 年的 11% 到 2026 年的 38%。图 22 的过去一周任务细项中，调研主题 24%、咨询建议 20%、回答事实问题 18%、请求推荐 15%、生成点子 14%、文本摘要 13%。调查为自报，可有多个用途。STORM、GPT Researcher 和 Gemini Cookbook 提供如何拆问题、搜索和核对出处的可查范例。[Oxford Reuters Institute，结果和方法](https://reutersinstitute.politics.ox.ac.uk/generative-ai-and-news-report-2026-standalone-tools-information-infrastructure)
2. **写作优先覆盖处理现成材料。** OpenAI 的消费端日志研究中，实用指导、找信息和写作合计接近八成。研究表 3 的写作细项包含编辑或批评已有文本、个人写作与沟通、翻译、生成摘要及写作创作。对 2026 年的复核采用更新至第三季度的 Signals。Fabric、Claude Cookbooks 和独立写作助手也有对应的处理范式，本项目把起草、改写、翻译和总结分别建项，因为它们保留原始材料的要求不同。[NBER 工作论文](https://www.nber.org/papers/w34255) · [OpenAI Signals](https://openai.com/signals/data/)
3. **学习需要覆盖辅导方式。** Pew 记录了美国青少年用聊天机器人帮助完成学校作业，四国对话研究也显示样本中课程用途与工作用途差不多常见。练习时，给一个提示、等待尝试和检查迁移是独立于「直接回答」的交互方式。Pew 的结果仅描述美国青少年，四国导出研究是自愿参与的预印本。[Pew](https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/) · [四国对话研究](https://arxiv.org/abs/2609.38279)
4. **开发、数据和媒体按专业场景纳入。** Claude 的开发产品中能观察到 API 调试、后端架构等任务，GitHub 开发技能库进一步展示代码理解、实现、测试和交付。通用 ChatGPT 消费使用与 Claude Code 的用户和入口差异很大。牛津调查还记录了 AI 出图使用从 10% 升至 19%（图 21）。数据部分许多细项来自可运行案例，图像编辑和视频分镜也主要有案例支持。应保留这些任务的专业价值，同时保留对跨平台普及程度的未知。[Anthropic Economic Index](https://www.anthropic.com/research/economic-index-june-2026-report) · [Awesome Copilot](https://github.com/github/awesome-copilot/tree/main/skills) · [Gemini Cookbook](https://github.com/google-gemini/cookbook/tree/main/examples)

## GitHub 对照表

通过 GitHub 搜索和目录查阅选出 14 个仓库。先看通用目录，再看研究代理、文本处理、开发、图像和数据各方向的专题实现。记录主要文件或目录及清楚可辨认的任务证据。表格是定向样本和可复查锚点，未做全站普查。一个仓库里的多个变体只算同一来源；例如 FrankX 明列上游导入，不能和被导入的 Fabric 条目当作两次独立发现。

| 样本 | 核查入口 | 观察到的用途或用法 |
| --- | --- | --- |
| f/prompts.chat | [公开 Prompt 目录](https://github.com/f/prompts.chat/blob/main/PROMPTS.md) | 常见的角色式命名，适合发现用户可能搜索的词，如导师、写作、翻译等。按任务拆开角色库中的混合意图。 |
| Fabric | [data/patterns](https://github.com/danielmiessler/Fabric/tree/main/data/patterns) | 摘要、主张和论文分析、正式邮件、演示分析、闪卡、图表、多种代码任务。文件夹通常对应单个可重复工作流。 |
| FrankX Prompt Library | [prompts](https://github.com/frankxai/prompt-library/tree/main/prompts) · [上游说明](https://github.com/frankxai/prompt-library#initial-upstream-sources-with-attribution) | 商务邮件、学习笔记、餐食规划、社交内容复用、代码评审。包含导入及原创条目。 |
| DAIR.AI Prompt Engineering Guide | [Examples of Prompts](https://github.com/dair-ai/Prompt-Engineering-Guide/blob/main/pages/introduction/examples.en.mdx) | 同一个指南分别演示摘要、实体提取、分类、问答、对话与写代码。 |
| GitHub Awesome Copilot | [skills](https://github.com/github/awesome-copilot/tree/main/skills) | 观察代码库、解释代码、整理复现、拆分需求、实现计划、文档编制。 |
| OpenAI Cookbook | [examples](https://github.com/openai/openai-cookbook/tree/main/examples) | 文档实体提取、数据清洗与转换、幻灯片、图像生成与高保真编辑。 |
| Claude Cookbooks | [capabilities](https://github.com/anthropics/claude-cookbooks/tree/main/capabilities) · [multimodal](https://github.com/anthropics/claude-cookbooks/tree/main/multimodal) | 摘要、分类、检索增强、Text-to-SQL 与多模态分析。 |
| Gemini Cookbook | [examples](https://github.com/google-gemini/cookbook/tree/main/examples) | 搜索支撑研究报告、引用匹配、实体提取、表单结构化和视频摘要。 |
| STORM | [工作流说明](https://github.com/stanford-oval/storm#how-storm--co-storm-works) | 多视角提问、检索、组织大纲、可追溯成文。 |
| GPT Researcher | [实际提示词模块](https://github.com/assafelovic/gpt-researcher/blob/master/gpt_researcher/prompts.py) | 生成检索查询、筛选相关证据、按问题摘要、写研究报告。 |
| Microsoft Generative AI for Beginners | [文本生成案例](https://github.com/microsoft/generative-ai-for-beginners/tree/main/06-text-generation-apps) | 文本生成、总结、从文本提取有用信息、多轮对话。 |
| Microsoft Promptbase | [guidance_programs](https://github.com/microsoft/promptbase/tree/main/guidance_programs) | 少样本及 JSON 输出示例。属技术演示，用来参考结构约束。 |
| Generative AI with LangChain | [Writing Assistant](https://github.com/benman1/generative_ai_with_langchain/blob/second_edition/writing_assistant/app.py) | 输入现成草稿并获得具体改进意见，可查应用中真正调用的指令。 |
| Awesome Nano Banana 2.1 Prompts | [图像与原帖](https://github.com/hanshs474/awesome-nano-banana-2-1-prompts) | 人像、产品及艺术图，参考照片风格变换；可对照生成图与原帖。 |

仓库目录统计的是供给信号，受维护者兴趣、单个产品定位、教程作者取材和交叉转载影响。Star、下载量、仓库大小和文件数量没有用于给模板定频。尤其是代码任务在 GitHub 上天然更显眼。

### 交叉出现的任务

从每条模板的来源映射展开，按主类统计被引用的不同 GitHub 仓库数。这个统计可用 `docs/catalog.json` 的 `prompts[].sources` 与 `sources` 联表复算。计数表示首版采用了多少个仓库作为此类模板的查找入口，含有关系的来源会重合，因此该列不用于估计用户使用频率。

| 主类 | 有引用的仓库数 | 可跨来源对照的例子 |
| --- | ---: | --- |
| 查找与研究 | 7 | STORM 与 GPT Researcher 都把写报告分成提问、检索和整理证据。Gemini Cookbook 单独检验引用和原文是否相符。 |
| 写作与语言 | 5 | Fabric 和 Writing Assistant 都接收现有草稿再反馈，Claude 和 Microsoft 的文本案例覆盖摘要。 |
| 学习与辅导 | 3 | Fabric 的闪卡、FrankX 的学习笔记和 prompts.chat 的辅导角色涵盖不同学习阶段。 |
| 计划与生活 | 4 | Fabric、FrankX 有创意与规划范式；餐食用途另有 ChatGPT 日志细类。 |
| 办公与协作 | 3 | Fabric 有会议或演示相关工作流，OpenAI Cookbook 有演示文稿案例；会议纪要交付形式另查 Microsoft 和 Google。 |
| 数据与表格 | 6 | OpenAI 和 Gemini 的实体提取示例都提供明确字段；Claude 的 SQL 示例另外处理表结构和查询。 |
| 开发与调试 | 3 | Awesome Copilot 可查代码理解与复现模板；Fabric 和 FrankX 有代码审查案例。测试细节另查 GitHub Docs。 |
| 创作与多媒体 | 7 | Nano Banana 社区案例与 OpenAI、Gemini 的案例都支持参考图或生成图意图；视频分镜参考 Gemini 与 Veo。 |

## 使用数据与各自的分母

| 来源 | 观测范围和时间 | 使用方式 |
| --- | --- | --- |
| [OpenAI / NBER](https://www.nber.org/papers/w34255) | 消费版 ChatGPT 的隐私保护分类研究，覆盖至 2025 年 7 月；按消息或对话统计时遵循论文各图表口径。 | 核对实用指导、找信息、写作和细类的存在。 |
| [OpenAI Signals](https://openai.com/signals/data/) | 更新至 2026 年第三季度，含工作与非工作等切分。 | 观察近期任务类别；与前一项同为 ChatGPT 观测，相关性高。 |
| [Oxford Reuters Institute](https://reutersinstitute.politics.ox.ac.uk/generative-ai-and-news-report-2026-standalone-tools-information-infrastructure) | 2026 年 8 月至 9 月在阿根廷、澳大利亚、丹麦、芬兰、法国、日本、挪威、英国、美国用 YouGov 在线调查；趋势比较取 6 国。 | 对照近期自报任务。调查方向偏信息用途，百分比不能直接和日志份额比较。 |
| [GVR Kiran 等](https://arxiv.org/abs/2609.38279) | 印度、尼日利亚、巴西、巴基斯坦，1,252 位参与者贡献 202,590 条 ChatGPT 会话，时间到 2026 年 2 月。 | 检查市场差异。例如巴基斯坦样本出现乌尔都语和英语翻译主题。样本为自愿导出。 |
| [Anthropic Economic Index](https://www.anthropic.com/research/economic-index-june-2026-report) | 2026 年 6 月报告，对 Claude 产品入口分别观察。 | 理解开发任务在特定入口的实际使用。 |
| [Pew Research Center](https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/) | 2026 年发布的美国青少年及父母调查。 | 对照学习和辅导需求；按人群解读。 |
| [AI2 WildChat](https://arxiv.org/abs/2405.01470) · [LMSYS Chat-1M](https://arxiv.org/abs/2309.11998) | 同意收集的多语种会话、以及模型体验和评估网站的多模型会话。 | 检查公开语料的来源和代表性边界。本项目查阅了论文和数据说明，未下载并重标原始对话。 |

[Google Workspace](https://workspace.google.com/learning/content/gemini-prompt-guide)、[Microsoft Copilot](https://enablement.microsoft.com/en-us/copilot/prompt-gallery/)、[OpenAI Academy](https://academy.openai.com/en/public/clubs/higher-education-05x4z/resources/prompt-pack-for-students)、[GitHub Copilot Cookbook](https://docs.github.com/en/copilot/tutorials/copilot-cookbook)、[Midjourney](https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics/) 和 [Veo](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/video-gen-prompt-guide) 提供面向终端用户的例子，补充了会议、协作、学习、测试和媒体的实际输入和交付格式。

## 分类规则与入选逻辑

按用户想要的**主要交付物**给每条任务分配一个主类，领域和英文同义词用标签表达。按输出能解决常见的边界问题。例如，压缩通用材料属于写作，提取负责人及截止日期的会议纪要属于协作，从合同抽取字段到 JSON 属于数据。视频分镜属于创作，代码变更和测试属于开发。可借用的提示技巧，如角色设定、例子和格式约束，嵌在任务里。

| 主类 | 首先覆盖 | 可追溯的拓展任务 |
| --- | --- | --- |
| 查找与研究 | 问答、主题研究、对比推荐 | 核对主张、读论文和制定检索方案 |
| 写作与语言 | 邮件、改写、翻译、摘要 | 评审初稿和跨渠道复用 |
| 学习与辅导 | 讲概念、解题指导、学习规划 | 练习测验、口语角色扮演和模拟面试 |
| 计划与生活 | 操作指导、餐食、头脑风暴 | 项目计划、行程和计划预检 |
| 办公与协作 | 会议纪要、进度汇报 | 演示大纲、反馈归纳、文档比对和交接 |
| 数据与表格 | 字段提取、数据探索 | 表格公式、SQL、图表和清洗 |
| 开发与调试 | 理解代码、定位问题、实现需求 | 代码评审、测试和重构 |
| 创作与多媒体 | 生成图像、读图、故事 | 改图、短视频分镜和多方向文案 |

证据标记分三类。「使用研究」表示现实使用数据支持同类目的，可能对应论文的上位类。「公开案例」表示能查到相似用途或工作流。「编辑补充」表示有明确交付价值，模板来自本项目对工作流的补足。每类 6 条是首版目录的编辑范围，各类及目录内的排列不代表相对频率。模板采用目标、可替换的真实输入、输出形式和简短的验收信号。项目核查了来源映射及模板交互，未对所有模板做跨模型效果对比。
