# Prompt Taxonomy 调研

调研截至 2026 年 11 月 19 日。本项目主要考察国际 GitHub 上公开的 Prompt、工作流与 Cookbook，再用国际调查和真实会话研究核对使用信号。产物是可复用的任务目录。V2.0 整理了 224 条原创模板，以 28 个国际 GitHub 仓库为主要样本，另有日志、调查、语料与官方案例，总计 49 个来源。模板与工作流的覆盖见 [任务覆盖审查](COVERAGE.md)。

## V2.0 扩充调研

从 V1.1 的 17 个 GitHub 样本起步，针对旧目录缺少独立交付物的领域做第二轮抽样。查看 11 个新增仓库的实际技能、README 或工作流目录，然后记录它们能支持的具体模板。例如，文件工作流有 PDF 页码、OCR 核对和 Office 渲染检查；客服工作流有分流、状态与人工交接；语言应用能看到分级、语域和可重复的口语练习。这个步骤支持分类和任务设计，无法用仓库出现次数替代用户量。

| 新增 GitHub 样本 | 核查入口及用于补齐的任务 |
| --- | --- |
| Anthropic Agent Skills | [技能目录](https://github.com/anthropics/skills/tree/main/skills)的 PDF、DOCX、PPTX、XLSX、内部沟通、品牌和网页测试案例。 |
| OpenAI Skills Catalog | [技能目录](https://github.com/openai/skills/tree/main/skills/.curated)的 PDF、转录、界面检查、CI 与上线验证。 |
| Microsoft MarkItDown | [转换能力与输出](https://github.com/microsoft/markitdown)支持把多格式材料变成可分析文本。 |
| Corey Haines Marketing Skills | [营销技能目录](https://github.com/coreyhaines31/marketingskills/tree/main/skills)的定位、SEO、渠道内容、广告试验和销售准备。 |
| Rasa Helpdesk Assistant | [工单例子与转人工](https://github.com/RasaHQ/helpdesk-assistant)支持服务任务的分流、状态和交接。 |
| Dialekt | [语言训练逻辑](https://github.com/cristianodabc/dialekt)支持按等级和正式程度调整对话。 |
| aoilang Language Learning Prompts | [模板目录](https://github.com/aoilang/language-learning-prompts)有语音材料复习、语境词汇和口语游戏。 |
| Resume Matcher | [功能示例](https://github.com/srbhr/Resume-Matcher)有职位说明、简历匹配和调整。 |
| Superpowers | [工程技能](https://github.com/obra/superpowers/tree/main/skills)包含计划、调试、评审和完成前验证。 |
| BMAD Method | [阶段化技能](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/skills)提供产品问题、需求与交付的连接。 |
| Microsoft AI Agents for Beginners | [教程](https://github.com/microsoft/ai-agents-for-beginners)有工具选择、规划、资料检索和上下文管理。 |

还补查了三类实用证据。OpenAI 的工作活动数据覆盖近 100 国、165 种中间工作活动，能确认模型被用于准备教学材料、制作营销内容、编程与分析，粒度比总主题更细，仍限个人版的工作相关消息。Microsoft Research 对 20 万次 Bing Copilot 会话的研究同样看到搜集信息、写作、教学和建议等任务。St. Louis Fed 以美国工人调查得到任务采用情况，补足了聊天日志只能看到进入平台的请求这一缺口。三者的分母不同，因此不合成榜单。[OpenAI Signals 工作数据](https://openai.com/index/chatgpt-expanding-world-of-work/) · [Microsoft Research](https://www.microsoft.com/en-us/research/publication/working-with-ai-measuring-the-occupational-implications-of-generative-ai/) · [St. Louis Fed](https://www.stlouisfed.org/on-the-economy/2026/sep/what-work-does-generative-ai-do)

生活用途继续用牛津跨国调查和四国会话预印本核对。除旅行、购物、做饭和学习，还能查到寻求建议、自我反思和互动等用途。服务运营与语言练习的细分则更多由专题案例支持。证据原始单位与旧版研究详见下文。

## V1.1 的基础调研

### 结论

1. **查资料、问具体问题、拿到可执行建议，应放在最容易找到的位置。** 牛津 Reuters Institute 2026 年在线调查覆盖 9 个国家。可跨年比较的 6 国中，过去一周用生成式 AI 获取信息的比例从 2024 年的 11% 到 2026 年的 38%。图 22 的过去一周任务细项中，调研主题 24%、咨询建议 20%、回答事实问题 18%、请求推荐 15%、生成点子 14%、文本摘要 13%。调查为自报，可有多个用途。STORM、GPT Researcher 和 Gemini Cookbook 提供如何拆问题、搜索和核对出处的可查范例。[Oxford Reuters Institute，结果和方法](https://reutersinstitute.politics.ox.ac.uk/generative-ai-and-news-report-2026-standalone-tools-information-infrastructure)
2. **写作优先覆盖处理现成材料。** OpenAI 的消费端日志研究中，实用指导、找信息和写作合计接近八成。研究表 3 的写作细项包含编辑或批评已有文本、个人写作与沟通、翻译、生成摘要及写作创作。对 2026 年的复核采用更新至第三季度的 Signals。Fabric、Claude Cookbooks 和独立写作助手也有对应的处理范式，本项目把起草、改写、翻译和总结分别建项，因为它们保留原始材料的要求不同。[NBER 工作论文](https://www.nber.org/papers/w34255) · [OpenAI Signals](https://openai.com/signals/data/)
3. **学习需要覆盖辅导方式。** Pew 记录了美国青少年用聊天机器人帮助完成学校作业，四国对话研究也显示样本中课程用途与工作用途差不多常见。练习时，给一个提示、等待尝试和检查迁移是独立于「直接回答」的交互方式。Pew 的结果仅描述美国青少年，四国导出研究是自愿参与的预印本。[Pew](https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/) · [四国对话研究](https://arxiv.org/abs/2609.38279)
4. **开发、数据和媒体按专业场景纳入。** Claude 的开发产品中能观察到 API 调试、后端架构等任务，GitHub 开发技能库进一步展示代码理解、实现、测试和交付。通用 ChatGPT 消费使用与 Claude Code 的用户和入口差异很大。牛津调查还记录了 AI 出图使用从 10% 升至 19%（图 21）。数据部分许多细项来自可运行案例，图像编辑和视频分镜也主要有案例支持。应保留这些任务的专业价值，同时保留对跨平台普及程度的未知。[Anthropic Economic Index](https://www.anthropic.com/research/economic-index-june-2026-report) · [Awesome Copilot](https://github.com/github/awesome-copilot/tree/main/skills) · [Gemini Cookbook](https://github.com/google-gemini/cookbook/tree/main/examples)

### GitHub 对照表（V1.1）

通过 GitHub 搜索和目录查阅选出 17 个仓库。先看通用目录，再看研究代理、文本处理、开发、图像和数据各方向的专题实现。记录主要文件或目录及清楚可辨认的任务证据。表格是定向样本和可复查锚点，未做全站普查。一个仓库里的多个变体只算同一来源；例如 FrankX 明列上游导入，不能和被导入的 Fabric 条目当作两次独立发现。

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
| Amplitude Builder Skills | [产品技能](https://github.com/amplitude/builder-skills/tree/main/product-skills/skills) · [分析技能](https://github.com/amplitude/builder-skills/tree/main/analytics-skills/skills) | 从用户访谈与机会发现到需求、优先级、实验和工单分析的完整流程。 |
| Anthropic Interactive Tutorial | [教程目录](https://github.com/anthropics/prompt-eng-interactive-tutorial) | 对比清晰指令、示例、格式控制和常见错误的练习。 |
| OpenAI Evals | [仓库与示例](https://github.com/openai/evals) | 用代表输入、参考输出和评分规则记录可复验的模型表现。 |

仓库目录统计的是供给信号，受维护者兴趣、单个产品定位、教程作者取材和交叉转载影响。Star、下载量、仓库大小和文件数量没有用于给模板定频。尤其是代码任务在 GitHub 上天然更显眼。

### 交叉出现的任务

从每条模板的来源映射展开，按主类统计被引用的不同 GitHub 仓库数。这个统计可用 [V1.1 的 catalog.json](https://github.com/liamamilin/Prompt-taxonomy/blob/43dba441d47ff064b050d75d59768a9983920d17/docs/catalog.json) 的 `prompts[].sources` 与 `sources` 联表复算。计数表示 V1.1 采用了多少个仓库作为此类模板的查找入口，含有关系的来源会重合，因此该列不用于估计用户使用频率。

| 主类 | 有引用的仓库数 | 可跨来源对照的例子 |
| --- | ---: | --- |
| 查找与研究 | 8 | STORM 与 GPT Researcher 都把写报告分成提问、检索和整理证据。Gemini Cookbook 单独检验引用和原文是否相符。 |
| 写作与语言 | 7 | Fabric 和 Writing Assistant 都接收现有草稿再反馈，Claude 和 Microsoft 的文本案例覆盖摘要。 |
| 学习与辅导 | 5 | Fabric 的闪卡、FrankX 的学习笔记和 prompts.chat 的辅导角色涵盖不同学习阶段。 |
| 计划与生活 | 4 | Fabric、FrankX 有创意与规划范式；餐食用途另有 ChatGPT 日志细类。 |
| 办公与协作 | 4 | Fabric 有会议或演示相关工作流，OpenAI Cookbook 有演示文稿案例；会议纪要交付形式另查 Microsoft 和 Google。 |
| 数据与表格 | 7 | OpenAI 和 Gemini 的实体提取示例都提供明确字段；Claude 的 SQL 示例另外处理表结构和查询。 |
| 开发与调试 | 3 | Awesome Copilot 可查代码理解与复现模板；Fabric 和 FrankX 有代码审查案例。测试细节另查 GitHub Docs。 |
| 创作与多媒体 | 8 | Nano Banana 社区案例与 OpenAI、Gemini 的案例都支持参考图或生成图意图；视频分镜参考 Gemini 与 Veo。 |
| 求职与职业 | 2 | FrankX 的简历和面试条目帮助发现常见任务，实际流程对照 OpenAI Academy 的求职案例。 |
| 产品与业务 | 2 | Amplitude 与 Awesome Copilot 对照需求与用户故事，Amplitude 也给出实验和优先级流程。 |
| 沟通与协商 | 2 | GitHub 样本用于对照处理异议和协作，客户投诉有 Microsoft 的公开案例，难开口的对话等由编辑补齐。 |
| 提示词与 AI 工作流 | 11 | Anthropic 交互教程、OpenAI Evals 和 Cookbook 对照输入示例、结构约束和效果验证。该数字也包含检索与上下文整理的相关案例。 |

### 使用数据与各自的分母

| 来源 | 观测范围和时间 | 使用方式 |
| --- | --- | --- |
| [OpenAI / NBER](https://www.nber.org/papers/w34255) | 消费版 ChatGPT 的隐私保护分类研究，覆盖至 2025 年 7 月；按消息或对话统计时遵循论文各图表口径。 | 核对实用指导、找信息、写作和细类的存在。 |
| [OpenAI Signals](https://openai.com/signals/data/) | 更新至 2026 年第三季度，含工作与非工作等切分。 | 观察近期任务类别；与前一项同为 ChatGPT 观测，相关性高。 |
| [Oxford Reuters Institute](https://reutersinstitute.politics.ox.ac.uk/generative-ai-and-news-report-2026-standalone-tools-information-infrastructure) | 2026 年 8 月至 9 月在阿根廷、澳大利亚、丹麦、芬兰、法国、日本、挪威、英国、美国用 YouGov 在线调查；趋势比较取 6 国。 | 对照近期自报任务。调查方向偏信息用途，百分比不能直接和日志份额比较。 |
| [GVR Kiran 等](https://arxiv.org/abs/2609.38279) | 印度、尼日利亚、巴西、巴基斯坦，1,252 位参与者贡献 202,590 条 ChatGPT 会话，时间到 2026 年 2 月。 | 检查市场差异。例如巴基斯坦样本出现乌尔都语和英语翻译主题。样本为自愿导出。 |
| [Anthropic Economic Index](https://www.anthropic.com/research/economic-index-june-2026-report) | 2026 年 6 月报告，对 Claude 产品入口分别观察。 | 理解开发任务在特定入口的实际使用。 |
| [Pew Research Center](https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/) | 2026 年发布的美国青少年及父母调查。 | 对照学习和辅导需求；按人群解读。 |
| [AI2 WildChat](https://arxiv.org/abs/2405.01470) · [LMSYS Chat-1M](https://arxiv.org/abs/2309.11998) | 同意收集的多语种会话、以及模型体验和评估网站的多模型会话。 | 检查公开语料的来源和代表性边界。本项目查阅了论文和数据说明，未下载并重标原始对话。 |

[Google Workspace](https://workspace.google.com/learning/content/gemini-prompt-guide)、[Microsoft Copilot](https://enablement.microsoft.com/en-us/copilot/prompt-gallery/)、[OpenAI Academy](https://academy.openai.com/en/public/clubs/higher-education-05x4z/resources/prompt-pack-for-students)、[GitHub Copilot Cookbook](https://docs.github.com/en/copilot/tutorials/copilot-cookbook)、[Midjourney](https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics/) 、[OpenAI Academy 求职案例](https://academy.openai.com/public/resources/helping-job-seekers-with-chatgpt-2025-12-03)、[Microsoft 客诉案例](https://enablement.microsoft.com/en-us/copilot/prompt-gallery/?steps=respond-to-a-customer-complaint) 和 [Veo](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/video-gen-prompt-guide) 提供面向终端用户的例子，补充了会议、协作、学习、测试和媒体的实际输入和交付格式。

### 分类规则与入选逻辑（V1.1）

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
| 求职与职业 | 岗位拆解、简历、求职信 | 行为面试、面试复盘、作品集和职业交流 |
| 产品与业务 | 用户访谈、产品需求、用户故事 | 机会发现、实验设计及复盘、支持工单 |
| 沟通与协商 | 反馈、跟进、投诉回应 | 分歧调解、困难对话、拒绝和协商 |
| 提示词与 AI 工作流 | Prompt 修复、示例、输出结构 | 评测对比、上下文交接和人工检查点 |

V1.1 对原有八类各补五条。新增条目优先填补独立交付物或验证步骤，例如从主题调研扩展到证据对照表和来源分歧检查，从表格公式扩展到透视、公式诊断和对账。沟通按实际互动与下一步分组，单纯的文字起草仍归写作。新增求职和产品条目主要有公开案例支持，现有国际数据无法给它们的具体 Prompt 排出统一频率。

证据标记分三类。「使用研究」表示现实使用数据支持同类目的，可能对应论文的上位类。「公开案例」表示能查到相似用途或工作流。「编辑补充」表示有明确交付价值，模板来自本项目对工作流的补足。各类的条目数量和展示顺序体现当前编辑范围。模板采用目标、可替换的真实输入、输出形式和简短的验收信号。项目核查了来源映射及模板交互，未对所有模板做跨模型效果对比。
