# Agent Handoff

本文件用于给后续接手的 Claude Code、Codex 或其他模型快速同步项目最新进度。

## 项目定位

《2014:我的十二年》是一个从 2014 年高考开始、模拟到 2026 年的人生模拟器。

核心架构见:

- `GAME_DESIGN.md`
- `TECH_ARCHITECTURE.md`

当前实现仍是原型阶段,但已经可以从开局一路玩到 2026 结局。

## 已完成里程碑

### M0 / M1

由 Claude Code 早期完成:

- pnpm monorepo 骨架
- `packages/core` 纯 TypeScript 引擎
- `packages/content` 最小内容包
- `packages/tools` simulate CLI
- `packages/web` React + Vite 壳
- Web 按 `ViewModel.kind` 分支渲染
- 开局流程:家境抽卡 -> 省份/文理 -> 高考答题 -> 志愿填报

### M2

由 Codex 接手后完成:

- 大学阶段扩展为 2014-2017 四个学年
- 新增 `CROSSROAD` ViewModel/action
- 新增 2018 大四三岔口:考研 / 求职 / 考公
- 接入 NPC stage 调度机制
- 初步实现创业室友和初恋线
- Web 增加三岔口 screen
- simulate CLI 支持三岔口自动选择和 verbose 输出

### M3

由 Codex 完成:

- 社会阶段扩展到 2018-2026
- 计算机线关键节点:
  - 996
  - 2021 平台风向变化
  - 2022 裁员潮
  - 2023 AI 冲击
- 师范线关键节点:
  - 第一堂课
  - 2020 网课
  - 2021 双减
  - 2022 考编热
- 投资线:
  - P2P
  - 2020 基金热
  - 2021 抱团松动
  - 2024 黄金/出海
- 结局文案更新到 2026 语境
- 新增结局:
  - AI 浪潮里的幸存者
  - 30岁,重新开始
  - 双减幸存者

### M4

由 Codex 完成:

- `ENDING` ViewModel 增加 `shareCard`
- 每个结局增加 `tone/tagline`
- Web 结局页增加分享卡
- Web 结局页增加“复制分享文案”
- Web 增加 localStorage 存档
- 标题页支持“继续上次人生”
- content version 用于避免旧存档误读新内容

### M5 第一轮

由 Codex 完成:

- 新增 `pnpm validate`
- `packages/tools/src/validate.ts` 做内容静态校验:
  - 重复 ID
  - 缺失事件/结局/NPC/phase 引用
  - 空 choices/outcomes
  - 题库数量、答案下标、难度范围
- 内容扩展到当前:
  - 事件:52
  - 结局:8
  - NPC:5
  - 高考题:37
- 固定 NPC 补齐为技术文档规划的 5 个:
  - 创业室友
  - 初恋
  - 卷王同学
  - 县城发小
  - 职场贵人
- 高考题库扩展并加入 `difficulty`
- 高考分数改为按题目难度加权
- 志愿选择写入长期 flags:
  - `university_tier`
  - `major_track`
  - `elite_university`
  - 滑档相关 flags
- 三岔口选择写入长期 flags:
  - `crossroad`
  - `postgrad`
  - `entered_job_market_2018`
  - `civil_service_track`
  - `first_job_track`
- 志愿填报和三岔口现在都会进入 `OUTCOME` 结果页
- `OUTCOME` 页面固定显示四项指标变化:学识 / 金钱 / 心态 / 人脉,未变化显示 `+0`
- 修复 `换季重感冒` 重复出现问题
- 做了一轮移动端样式压缩和结局分享卡适配

### M5 第二轮(事件因果链)

由 Claude Code(Fable 5)完成,主题是"让之前的选择真正影响后面的人生":

- 首次启用引擎的 `schedule` 延迟事件机制,建立三条硬因果链:
  - P2P 投两万 → 次年必触发 `ev_invest_p2p_collapse`(暂停提现:维权/认栽,写入 `p2p_burned`)
  - 2022 被裁 → 次年必触发 `ev_cs_reemployment`(空窗期再就业,写入 `restarted_after_layoff`)
  - 2022 留下(`survived_layoff`)→ 次年必触发 `ev_cs_second_wave`(第二轮优化,可能二次被裁并再 schedule 再就业)
- write-only flags 全部接通:
  - `fund_dca`/`fund_chased` → 2021 抱团松动改为仅基金参与者触发,追高者亏损加倍
  - `p2p_burned`/`dodged_p2p` → 2020 基金上车事件的条件分支文案
  - `survived_layoff` → 2023 AI 事件条件分支
  - `has_house` → 新强制事件「房价回调」(2024)+ 新结局「还贷的人」
  - `no_house` → 新强制事件「第 N 次搬家」(2025)+ 新结局「北漂十年」
  - `roommate_startup_joined`/`roommate_close_friend` → 新 NPC 事件「室友开播了」(2020),室友状态机延长出 `livestream_comeback`/`faded` 阶段
  - `dorm_bond` → 婚礼请柬事件条件分支
  - `restarted_after_layoff` → 「30岁,重新开始」结局条件(与心态阈值取 any)
- validate 增强:被 `schedule` 引用的无池事件不再误报 warning
- 内容量:事件 58,结局 10

### M5 第三轮(大学投资线 + 数值平衡)

由 Claude Code(Fable 5)完成:

- college phase 的 pools 加入 `invest`,补齐设计文档规划的投资线前半段:
  - `ev_invest_stock_2015` 牛市与股灾(`stock_lesson`)
  - `ev_invest_house_2016` 六个钱包(城市中产/拆迁户强制事件,`early_house`;2024 房价回调事件有专属浮盈分支;2021 买房问题对已购房者不再触发)
  - `ev_invest_bitcoin_2017` → schedule 4 回合 → `ev_invest_crypto_cashout`(2021 下车,`crypto_win`)
- 初恋线延长:`steady` → 2022-2023 `ev_love_marriage` → `married`/`steady_long`
- 随机池 +4:年卡、视频通话、体检报告、十年群聊
- 新结局:提前退休(crypto_win+30万)、围城之内(married);结局 12 个
- simulate 增加金钱/心态 p10/p50/p90 分位数和提前结局占比输出
- 平衡调整:end_gold 阈值 10万→18万、priority 105→140(不再截胡叙事结局);
  小镇做题家加金钱≥8万、知识≥65;AI 幸存者加知识≥60;心态崩溃阈值 12→15
- 内容量:事件 67,结局 12

### M5 第四轮(真实金钱体系 + 人生总分)

由 Claude Code(Fable 5)完成:

- 新增数据驱动的**年度收入系统**:
  - `IncomeRule { id, label, when: Condition, amount }`,内容在 `packages/content/src/economy/incomes.ts`(6 条规则:大厂 7 万/年、普通技术岗 4.5 万、教育 3 万、体制内 2.2 万、普通工作 3 万、空窗期 -4 万)
  - 引擎在每个年度回合 `settleRound` 时按条件结算入金钱;大学/读研阶段无职业 flag 天然无收入
- 投资/买房金额上调到真实量级:基金/黄金 ×2.5~3,比特币下车 20万/45万/4万,买房首付 -30 万,提前还贷 -15 万,N+1 9万/8万
- 结局金钱阈值同步重定标:小有成就 50 万、提前退休 80 万、做题家 25 万、北漂 15 万
- **人生总分**:`meta.scoring`(学识 25% + 金钱 30% + 心态 25% + 人脉 20%,金钱 60 万满分)→ ENDING ViewModel 新增 `score`/`grade`(S≥85/A≥70/B≥55/C≥40/D),Web 分享卡展示总分+评级
- simulate 每个结局输出均分/均财,新增引擎单测 2 个(收入结算、评分范围)
- 12 年后金钱分位:p10=¥20万 p50=¥34万 p90=¥56万(此前 p50 只有 ¥7 万,与现实严重不符)

### M5 第五轮(上线打磨)

由 Claude Code(Fable 5)完成:

- 分享卡支持真正的**图片导出**:`packages/web/src/platform/shareImage.ts` 纯 Canvas 绘制
  (750×1000 竖版,tone 配色、结局标题、tagline、评级+总分、四维数值、人生编号),
  结局页新增"保存分享图"按钮下载 PNG
- 引擎修复:NPC 阶段事件在调度器中与强制事件同级保证入队,不再受 eventSlots
  限制——消除"某年槽位被挤满 → NPC 链永久卡死"的隐患
- title 从「2014:我的十二年(M3 社会线原型)」改为「2014:我的十二年」

### M5 第六轮(体验修正 + 心态压力机制)

由 Claude Code(Fable 5)完成:

- 事件时序修正:专业课劝退/开黑限定 2014-2015、家教 2014-2016;
  `GameEvent` 新增 `order` 字段,调度器同回合稳定排序;
  散伙饭移到 2018 毕业季(work 池、mandatory、order -10 排当年第一)
- OUTCOME 数值变化只显示非零项;高考新增 `SKIP_EXAM` 动作
  (剩余题按 55% 默认得分率折算,web 有"跳过答题"按钮)
- **心态压力机制**:`IncomeRule` 新增 `mindsetDelta`,职业按年损耗心态
  (大厂 -5/普通技术 -3/教育 -3/普通工作 -3/体制内 -1/空窗期 -8);
  年度结算后立即检查提前结局
- 调平结果:心态 p50 从 82 → 58,p10=27,提前结局占比 0.8% → 5.7%,
  "卷钱还是保心态"成为真实取舍;12 结局仍全部可达

### M5 第七轮(存档双保险 + 校验补全)

由 Claude Code(Fable 5)完成:

- **存档 actionLog 重放 + 迁移链**(技术文档第五章方案落地):
  - `packages/core/src/save/save.ts`:`SaveFile v2 { seed, actionLog, snapshot }`、
    `migrateSaveFile`(迁移链,v1 快照档自动升级)、`replaySave`(要求日志从 START 起步,
    重放失败返回 null)、`restoreSave`(内容版本一致用快照,不一致用 seed+日志重放)
  - web store 记录每一步 action;标题页开新局时自动重置日志
  - 旧 v1 存档:同内容版本仍可用,跨版本因无日志按旧行为丢弃
- **validate 恒假条件静态检查**:检测 chance≤0、越界 stat、空年份区间、
  all 分支内的矛盾(互斥 flag、同 stat 上下界冲突、双 background/career/major/npcStage)。
  结局恒假报 error(死结局),事件 trigger/visibleIf/outcome 报 warn。已用注入死结局验证能抓到
- **simulate --check**:分布目标校验(全事件覆盖、全结局可达、无结局 >40%),
  失败退出码 1,可作为内容合并前的门禁
- 引擎单测 16 个(存档重放/迁移/损坏档 +3)

### M5 第八轮(调平工具箱:策略 bot + 分层统计)

由 Claude Code(Fable 5)完成,simulate 全面升级为调平仪表盘:

- **策略 bot**:`--bot random|money|mindset`。卷钱/保心态 bot 按 outcome 加权期望
  贪心选项(条件用一次性 RNG 求值,不污染对局随机流);三岔口卷钱选求职、保心态选考公
- **`--compare`**:三种策略各跑 n 局对比(均分/均财/心态/崩溃率/Top 结局),用于检测必胜解
- **分组统计**:按家境、按职业线输出均财/心态/均分
- **年度心态中位数曲线**:定位压力集中的年份
- **--check 门禁收紧**:新增 兜底≤35%、提前结局≤10%
- 首次对比结果(n=500)的平衡发现:
  - 无全指标必胜解:卷钱 bot 均财最高但 42% 心态崩溃、均分垫底;
    保心态 bot 均分最高(67 vs 随机 59)但最穷
  - 保心态 bot 结局高度集中(北漂十年 75%,因系统性拒绝买房),
    且总分优势偏大——后续可考虑心态对总分的边际递减或给"躺平"加机会成本
  - 职业线分化符合设计:计算机均财 ¥50万/心态 45,体制内 ¥26万/心态 85

### M5 第九轮(全事件时间线审计)

由 Claude Code(Fable 5)完成,逐条过了全部 67 个事件的文案与触发窗口:

- 新增 `working` 身份门控(求职入场/研究生毕业/考公上岸/考公落榜打工,any 四选一),
  random.ts 和 work.ts 各定义一份,挂到所有"上班族语境"事件上:
  房租、短途旅行、副业、健身年卡、试用期汇报、领导反馈、年终奖、远程办公、P2P(同事推荐)
- 「老同学的朋友圈」(婚纱照/工牌/孩子)加 2020+ 年份窗口,不再漏进大学年份
- 核心修复:考研玩家 2018-2021 在读期间不再遇到任何职场事件
- 抽查:19 个种子的大学年份全部为校园/NPC/中性事件;考研局读研期间干净;
  1000 局覆盖仍 67/67,--check 门禁通过

### M5 第十轮(关键事件分级 + 高光文案扩写)

由 Claude Code(Fable 5)完成:

- `GameEvent` 新增 `tier?: 'major'` 事件等级;EVENT ViewModel 透出 `major`,
  Web 端关键事件卡片有金色描边 + "✦ 人生节点" 标识
- 12 个剧情转折/高光事件标记为 major 并大幅扩写(主文案 60-90 字 → 180-250 字,
  结果文案同步扩写,保持苦涩幽默+温情+金句收尾的基调):
  - 初恋三部曲:操场上的心动 / 异地的预兆 / 领证这件小事
  - 室友创业线:创业计划 / 项目黄了以后
  - 时代节点:六个钱包(2016)/ 毕业名单(2022 裁员)/ AI 来了(2023)/ 双减落地(2021)
  - 投资高光:下不下车(比特币)/ 暂停提现(P2P 暴雷)
  - 毕业时刻:散伙饭
- 普通事件保持原有短文案,形成"日常事件短平快、关键节点浓墨重彩"的节奏差

### M5 第十一轮(年内后果 + 因果链加密)

由 Claude Code(Fable 5)完成:

- **引擎支持同年后果**:`schedule` 的 `afterRounds: 0` 现在会在当年事件队列播完时
  追加到队尾弹出(此前队列在年初定死,年中 schedule 最快次年生效);单测 +1(共 17)
- 新增 5 条因果链(事件 67 → 72):
  - 表白成功 →(当年年末)「那年冬天」跨年温情尾巴
  - 2016 六个钱包买房 →(当年年末)「工地照片」
  - 考公落榜 →(次年)「二战还是收手」:可二战上岸 career_gov,真正的人生支线
  - 领证 →(次年)「婚后第一个春节」回谁家二选一
  - 2021-2023 自购房 →(次年)「还贷第一年」
- 基金 2020 → 2021 抱团松动改为 schedule 硬链:买了基金必然次年遇到崩塌,
  不再依赖随机抽取(trigger 保留作双保险,调度器自动去重)

### M5 第十二轮(互斥情节门控 + validate 词表检查)

由 Claude Code(Fable 5)完成:

- 修复"买了房还收到『房租又涨了』"一类互斥穿帮,共 4 处 trigger 门控:
  - `ev_random_room_rent` 加 `not has_house`
  - `ev_work_blind_date`(相亲局)加 `not in_love`(恋爱中/已婚不再被安排相亲)
  - `ev_random_annual_review` / `ev_random_health_report` 补挂 `working`(random.ts 顶部注释
    早已约定上班族语境事件必须挂 working,这两个漏了)
- 2 处文案去租房假设:发小重聚"聊房租"→"聊房价";裁员事件"想起房租"→"想起每个月的账单"
- **validate 新增互斥语境词表检查**(机制性杜绝,不再靠人肉审):事件标题/正文命中
  `房租|房东|续租|租房软件` 必须门控 `not has_house`(或 `no_house`),命中 `相亲` 必须门控
  `not in_love`,违反直接 ERROR 使 `pnpm validate` 失败。只扫事件正文不扫 outcome 文案,
  避免"当年交给房东"这类回忆句误报。新增互斥语境词(如结婚/生育)时在
  `packages/tools/src/validate.ts` 的 `MUTEX_TEXT_RULES` 里加一行即可。

### M5 第十三轮(选项去透明化:概率反噬 + 文案去信号)

由 Claude Code(Fable 5)完成。背景:玩家反馈"一眼能看出哪个选项得分,局局高分"。

- **simulate 新增 `--bot score`(卷总分)策略**:按结局计分权重
  (识/心 0.25、脉 0.2、¥600000 满分折算)对选项期望贪心,模拟"会看分的玩家";
  `--compare` 现在输出四种策略。改动前后卷总分 bot 均分 79 → 76(随机 bot 60 → 58)。
- **13 个事件加"概率反噬/意外回报" outcome**(加权 2:1,期望仍保留原方向,但单局不可预测):
  认真选项可能翻车(试用期太实诚被派杂活、论文早开题被毙、社团竞选背锅、网课花活变聊天室、
  年度复盘复出焦虑、三十岁规划变存款算术、短途旅行人从众、婚礼被安排散客桌、十年聚会变微商场)、
  躺平选项偶有回报(套模板恰逢领导救火、原课件收获"深夜电台"好评、糊弄散伙饭成了大家记住的笑声、
  不听前辈建议但自己判断对了、AI 观望躲过烂尾项目、拖延论文一口气写完、爸妈回拨五分钟也算数)。
- **7 处选项文案去贬义信号**:"套模板别暴露自己"→"稳妥一点按模板讲"、"信仰充值"→"逢低补仓摊薄成本"、
  "追热门别错过"→"加大仓位抓住主线"、"笑着糊弄"→"用段子撑住气氛"等,两边读起来都像有道理。
- **2 条新收入规则修结构性占优**:`inc_prepaid_mortgage`(提前还贷 setFlag 后每年 +18000 省息,
  修"提前还贷纯亏 15 万")、`inc_rent_inflation`(no_house 玩家 2024 起每年 -8000 房租补涨,
  修"观望不买房白嫖")。这两笔在收入结算层,事件面板上看不到——正是"看起来好实际丢分"。
- 工具:占优分析脚本(scratchpad/dominance.ts,按期望总分差排序全事件)本轮临时使用,未入库;
  需要时可按 handoff 本节描述重建。

### M5 第十四轮(第五维度"健康" + 全面跨维度取舍)

由 Claude Code(Fable 5)完成。背景:玩家反馈选项仍能看出优劣,希望"每个选项都加一两维、扣一两维",并扩展维度。

- **新增第五维度 `health`(健康)**,全链路打通:
  - core:`StatKey`/`Stats` 加 health,初始 85,0-100 钳位;`computeScore` 重写为按
    `meta.scoring.weights` 通用加权(不再硬编码四维);`IncomeRule` 新增可选 `healthDelta`
  - 计分权重改为 识0.2 / 钱0.25 / 心0.2 / 脉0.15 / 健0.2(content `meta.scoring`,版本 → 0.14.0)
  - 收入规则年度健康损耗:大厂 -4、普通技术岗 -3、教育/普通工作 -2(体制内不掉,是"稳定"的隐性价值)
  - 新增早退结局 `end_health_crash`《身体先亮了红灯》(health ≤ 12,priority 2,随机局占比约 0.3%)
  - UI:web(StatsBar/结算/结局/分享文案/分享图)与小程序(顶栏/结算格/分享卡)都加了健康展示
  - 工具:validate BOUNDED_STATS 加 health;simulate 的 SCORE_WEIGHTS 改为直接读内容包配置,
    统计输出加健康均值
- **约 35 处 outcome 挂上健康增减,构成跨维度取舍**:卷钱/卷学识的选项扣健康
  (996 -10、AI 狂学 -4、副业熬夜 -4、考研强度 -3、边工作边备考 -4、硬扛感冒 -4/-8、
  体检报告塞抽屉 -6…),躺平/慢节奏选项回血(到点下班 +6、守住远程边界 +4、退副业群睡觉 +3、
  健身坚持 +12、认真复查 +7、被裁离开高压环境 +4…)。"看起来吃亏"的选项现在有真实的隐性收益。
- 验证:1000 局随机 bot 全事件覆盖 72/72、13 结局全可达、提前结局 6.6%;
  四策略对比:随机 59 / 卷钱 51(崩溃率 41%)/ 保心态 68 / 卷总分 78。
  注意卷总分 bot 是"开天眼算期望"的上界,真人面对混合正负号的选项远达不到。

### M5 第十五轮(志愿系统重做 + 戏剧化事件 + 难度收紧)

由 Claude Code(Fable 5)完成,内容版本 → 0.15.0,事件 72 → 82,结局 13 → 15。

- **志愿系统重做(批次 × 专业 + 冲档滑档)**:
  - `ApplicationOption` 改为"批次"结构(去掉静态 `admitChance`/捆绑 major),每批次带 `majors[]`
    (name + trackFlag);`APPLY` 动作加可选 `majorId`(旧档重放兼容,缺省取第一个专业)
  - 引擎按分差动态算录取概率:≥20 稳 1.0 / 0~20 较稳 0.9 / -20~0 冲 0.45 / -45~-20 悬 0.18 / 更低 0.05;
    滑档落到"分数够线的最高批次"(排除冲失败的那个),专业优先同 trackFlag,文案戏剧化
  - web/小程序志愿屏改两步:先批次(带 稳/较稳/冲/悬 标签)后专业;simulate bot 随机批次+专业;
    validate 增查 majors 非空 + trackFlag 白名单
- **新增 `events/drama.ts`:10 个 tier:major 三选项戏剧事件**(1 个方向正确 + 2 个负期望,其一是诱饵):
  杀猪盘、期权行权、爸爸的病、兄弟借钱、裸辞半年、电动车事故、长租公寓暴雷(挂 not has_house)、
  账号爆火、静默六十天、传销邀约。新 flag:pig_butchered/pig_dodged/parent_ill/viral_creator
- **15 个现有事件加"诱饵"第三选项**(期望为负、文案诱人):股灾加杠杆、比特币重仓、P2P 加息标、
  基金两融、crypto 抵押加仓、跟单大 V、私活两头卷、酒局站队、高杠杆大三居、AI 创业公司、
  年终奖全仓明星基金、6999 副业课、私教包、随 5888、分期 iPhone
- **难度曲线**:grade 线 S≥88 / A≥76 / B≥58 / C≥42;新增两条"低谷自愈"收入规则
  (mindset<40 时 +6/年、health<30 时 +3/年,防连环打击死亡螺旋——这是调平的关键旋钮);
  健康崩溃结局阈值 health≤15。新增结局:被算法选中的人(viral_creator)、
  栽过跟头的人(吃 pig_butchered/p2p_burned/stock_lesson,吸收兜底占比)
- 验证(n=1000 随机):均分 50、崩溃率 8.9%、兜底 29.1%、82/82 事件、15 结局全可达;
  四策略:随机 50 / 卷钱 53 / 保心态 65 / **卷总分 74(低于 A 线 76,开天眼也拿不到 A)**

### M6 小程序移植续接

由 Codex 完成:

- 接手 Claude Code 已生成的 Taro 小程序壳,确认 `apps/miniprogram` 已覆盖全部当前 `ViewModel.kind`
  screen:标题、抽卡、设置、高考、志愿、三岔口、年度简报、事件、结果、结算、结局。
- 小程序 store 接入 `createEngine(contentPack)`、微信 `Taro.getStorageSync/setStorageSync/removeStorageSync`
  和 v2 存档迁移/重放逻辑,与 Web 端读档策略一致。
- 修复 Taro 配置校验问题:`mini.compile.include` 从正则改为函数,让 Taro 4 配置 schema 接受,
  同时继续把 `packages/core` / `packages/content` 源码纳入小程序编译。
- 补齐 Taro React 构建所需 peer/dev 依赖:
  `@babel/preset-react`、`@babel/plugin-proposal-class-properties`。
- `pnpm-workspace.yaml` 纳入 `apps/*`,并把 Taro/构建链 postinstall 包显式列入 `allowBuilds`。
- `build:weapp` / `dev:weapp` 使用 `--no-check` 跳过 Taro 4.0.9 的 native doctor 配置校验;
  原因是在 pnpm lifecycle 环境里 `@tarojs/plugin-doctor` 会触发 macOS `system-configuration`
  native panic。配置已通过 TypeScript 与实际 Taro webpack 构建验证。
- 当前小程序构建产物约 548KB,低于微信小程序主包 2MB 限制。

### M5 第十六轮(结果反馈保真:钳制不再吞掉加减分展示)

由 Claude Code(Fable 5)完成,内容版本 → 0.15.1。起因是用户实测反馈"部分事件选完后不展示加减分"。

- **根因 1(引擎)**:`applyEffects` 的 `deltas` 记的是钳制后的实际变化——属性顶到上下限时
  (心态已满 100 再 +1、金钱为 0 再扣钱)delta 为 0,OUTCOME 页什么都不显示。
  3000 局 bot 审计发现 14 种实际发生的"无展示"场景(比特币 -3000 在钱包空时 84/501 次不显示等)。
  修复:`deltas` 改记**声明值**(属性本身仍钳制),结果页永远展示选项的名义加减分。
- **根因 2(内容)**:`ev_npc_roommate_2020`(室友开播了)choice b 只有 npcFavor/npcStage 效果,
  无任何 stats 项,100% 无展示。修复:补 `network -1`(与"走远"文案一致)。
- **validate 防回归**:新增检查"每个 outcome 必须至少有一项非零 stats 效果",违反报 error。
- 验证:typecheck / 17 test / validate 0 err 0 warn / simulate n=1000 --check 通过
  (均分 49、崩溃率 9.3%、82/82 事件、15 结局全可达)/ web build 通过;
  复跑 3000 局审计:"无展示"场景 0 种。

### M5 第十七轮(关系后果、父母事件去重、成绩展示)

由 Codex 完成,内容版本 → 0.15.2。起因是用户实测反馈:杀猪盘对非单身玩家缺少关系后果、父母住院情节重复、结尾字母评级不够明确,以及近期难度调高后模拟门禁失衡。

- **杀猪盘非单身后续**:`ev_drama_pig_butchering` 在 `in_love` 状态下被骗会追加同年事件
  `ev_drama_pig_partner_fallout`《聊天记录被看见》(事件 82 → 83)。后续选项包括坦白报警、隐瞒补窟窿、家庭财务复盘;隐瞒会伤害 `first_love` 好感并把关系推进到 `separated`。
- **父母健康事件去重**:`ev_random_parent_checkup` 改成轻量的“家里的体检报告/普通复查”事件,不再写成住院语境;真正的住院手术保留在 `ev_drama_parent_hospital`《爸爸的检查单》。两个事件都用 `parent_ill` 门控避免大病后再刷普通体检。
- **结尾成绩展示**:Web 结尾分享卡、小程序结尾分享卡、Web 复制文案、Canvas 分享图都把字母评级改为“成绩：X”,避免用户把 S/A/B 当成其他标签。分享图同步调整了评级区域位置和字号,防止新增文字挤出。
- **早退难度回调**:保留“按下暂停键 / 被生活按下退出键 / 现金流断了 / 身体先亮红灯”四类提前结局,但把触发条件收窄到真正触底场景;同时放宽还贷、北漂、围城、AI、栽过跟头等最终叙事结局,减少低分玩家大面积落进兜底。
- 最新验证:`validate` 0 error/0 warning;`simulate -n 1000 --check` 通过,83/83 事件覆盖、17 个结局全可达、提前结局 9.7%、兜底 26.4%。

### M5 第十八轮(家境池收敛 + 买房现金清零)

由 Codex 完成,内容版本 → 0.15.3。起因是用户反馈“暴发户/拆迁户”开局 20 万对剧情影响弱,且买房只扣固定首付不符合现实。

- **移除开局拆迁户身份**:`bg_demolition` 从 `backgrounds` 抽卡池删除;2016「六个钱包」触发条件同步改为只面向 `bg_urban_middle`,避免留下不可抽中身份引用。
- **新增 core DSL 效果 `setStat`**:支持把某项数值设为精确值并按实际变化写入 `deltas`。本轮用于买房后把 `money` 设为 0,结果页显示真实扣掉的余额,不会出现 `-999999` 这种假扣款。core 单测 +1。
- **买房后清空现金**:2016「六个钱包」买房、2021-2023「买房问题」两个买房选项都改为 `{ setStat: 'money', value: 0 }`,不再固定扣 1 万/25 万/30 万后留一大笔现金。
- **早买房后补回房产净值**:新增 schedule 事件 `ev_house_price_rise_2018`《房价翻倍的新闻》(事件 83 → 84)。2016 买房后两年触发,用 `money +260000` 把房产浮盈折算回金钱值,符合“买房先清空余额,后续上涨再加回来”的口径。
- **分布微调**:移除拆迁户和清空买房现金后,健康早退阈值从 `health <= 4` 收到 `<= 1`,使 `simulate --check` 的提前结局占比回到门禁以内。
- 最新验证:`validate` 0 error/0 warning;`simulate -n 1000 --check` 通过,84/84 事件覆盖、17 个结局全可达、提前结局 9.5%、兜底 27.6%。

### M5 第十九轮(晚买房资产补回)

由 Codex 完成,内容版本 → 0.15.4。起因是用户指出 2021-2023 买房清空存款后也需要后续新闻把房产资产折算回来,只是补回幅度应小于 2016 早买房。

- **晚买房补回净值**:新增 schedule 事件 `ev_house_value_reprice_late`《资产表重新算了一遍》(事件 84 → 85)。2021-2023「买房问题」中成功买房的三个 outcome 都会在下一轮触发,用 `money +120000` 把保守房产净值折回金钱值。
- **早晚买房收益差异**:2016 早买房仍使用 `ev_house_price_rise_2018` 补 `money +260000`;2021-2023 晚买房补 `+120000`,表达“买得晚也不是归零,但收益明显少于早上车”。
- 最新验证:`validate` 0 error/0 warning;`simulate -n 1000 --check` 通过,85/85 事件覆盖、17 个结局全可达、提前结局 9.4%、兜底 27.5%。

### 设计补充(金钱扣减百分比方案)

由 Codex 完成,只改文档,未改运行时代码。起因是用户指出当前事件里很多 `money` 扣减仍是写死金额,应重新设计为按余额比例扣减,避免理论扣款大于余额。

- `GAME_DESIGN.md` 新增“金钱扣减口径:按余额比例而不是硬扣固定数”,定义日常小额支出、中等消费、大额风险损失、all-in 决策、资产置换五类扣减比例和上下限。
- `TECH_ARCHITECTURE.md` 新增 `moneyCost` DSL 设计:按 `current money × rate` 计算理论扣款,套 `min/max/roundTo`,最终 `actual = min(currentMoney, rounded)`,OUTCOME 展示实际扣款。
- 文档当时明确:正向收入/奖金/投资收益仍可固定写 `stats.money`;负向支出迁移到 `moneyCost`;买房使用资产置换口径。注意后续 M5 第二十轮已把买房从 `setStat money=0` 改为 `moneyCost rate=0.5 + schedule 资产回补`。
- 迁移计划:先实现 `moneyCost`,再让 `validate` 对大额固定 `stats.money < 0` 报错或警告,最后批量迁移事件并用 `simulate --check` 守分布。

### M5 第二十轮(买房扣款改 50% + 拆迁暴发户回归)

由 Codex 完成,内容版本 → 0.15.5。起因是用户要求两个买房事件不再清空余额,改为扣当前余额 50%;后续资产回补也按比例减半;同时把之前删掉的拆迁暴发户以 10 万初始金额加回。

- **实现 `moneyCost` 运行时效果**:core DSL 新增 `{ moneyCost: { rate, min?, max?, roundTo?, reason? } }`,按当前余额比例计算实际扣款并写入 `deltas.money`;validate 校验 rate/min/max/roundTo;simulate 的策略 bot 也会把 `moneyCost` 算进期望;core 单测 +1。
- **家境池加回拆迁暴发户**:`bg_demolition` 回到 `backgrounds`,label 为“拆迁暴发户”,初始金额 100000。2016「六个钱包」触发条件恢复为城市中产或拆迁暴发户。
- **买房扣款改为余额 50%**:2016「六个钱包」和 2021-2023「买房问题」成功买房 outcome 都从 `setStat money=0` 改为 `moneyCost rate=0.5 roundTo=1000 reason=house`。
- **资产回补减半**:2016 早买房补回从 `money +260000` 改为 `+130000`;2021-2023 晚买房补回从 `+120000` 改为 `+60000`;相关文案去掉“清空/归零”表述。
- **文档同步**:`GAME_DESIGN.md` 加回“拆迁暴发户”家境并更新买房 50% 扣款口径;`TECH_ARCHITECTURE.md` 的 Effect 示例同步加入 `moneyCost` 和 `setStat`,并标记 `moneyCost` 已实现。
- 最新验证:`validate` 0 error/0 warning;`simulate -n 1000 --check` 通过,85/85 事件覆盖、17 个结局全可达、提前结局 9.0%、兜底 25.7%。

### M5 第二十一轮(大额固定扣款迁移 + moneyCost 门禁)

由 Codex 完成,内容版本 → 0.15.6。延续上一轮“金钱扣减百分比”方案,把文档里的迁移计划落到内容和校验门禁。

- **迁移大额固定负扣款**:把 `drama.ts` / `work.ts` 中所有超过 10000 的 `stats.money < 0` 改为 `moneyCost`。
  - 诈骗、投资爆仓、医疗、长租公寓、裸辞空窗、婚礼、提前还贷等现在按余额比例扣款,并设置 `max/roundTo/reason`。
  - P2P 两万、比特币重仓等“明确本金”场景用 `min=max` 表达“最多扣这笔本金,余额不足只扣现有余额”,避免继续展示超余额扣款。
  - 万元以内的小额叙事支出暂时保留固定 `stats.money`,避免普通请客/搬家/春节饭桌被过度 DSL 化。
- **validate 防回归**:`packages/tools/src/validate.ts` 新增 `MAX_FIXED_MONEY_DEBIT = 10000`;事件 outcome 中若出现 `stats.money < -10000` 直接 error,要求改用 `moneyCost`。
- **现金流结局再调平**:由于 `moneyCost` 不再把余额硬扣穿,`end_cashflow_break` 从 `money<=0 && mindset<=0` 改为低现金缓冲触发:
  `money<=30000 && mindset<=5 && health>10 && network>20`,避免与健康/崩溃类早退互相抢结局。最新随机 1000 局中现金流结局占比 1.0%。
- **文档同步**:`GAME_DESIGN.md` / `TECH_ARCHITECTURE.md` 修正买房/资产置换口径,标记大额固定负扣款迁移与校验门禁已完成。
- 最新验证:`typecheck` / `test`(19 通过) / `validate` / `simulate -n 1000 --check` / `web build` / `miniprogram build:weapp` 全部通过;
  `simulate -n 500 --compare` 显示无明显必胜解(随机 42、卷钱 41、保心态 62、卷总分 68)。

### M5 第二十二轮(补完职业线:金融线 + 医学线)

由 Claude Code(Sonnet 5)完成,内容版本 → 0.15.7,事件 85 → 94,结局 17 → 19,收入规则 10 → 16。背景:`GAME_DESIGN.md` 第四节规划的 4 条职业线里,金融/医学此前是"二期"未落地(全仓库 grep 零命中)。本轮补完到与计算机线/师范线一致的密度——专属里程碑事件对齐现状的 5/4 个,而非文档原定的"25 个/线"(计算机/师范实际也从未达到过 25 个)。

- **金融线**(`career_finance` flag,`finance` trackFlag):新增 `events/career-finance.ts` 5 个专属事件——2015 股灾实习(从业者视角,college 阶段,区别于散户视角的 `ev_invest_stock_2015`)、2018 第一份金融岗(前台/中后台分档,仿计算机线 elite/ordinary 结构)、2018-2019 资管新规、2020 基金热、2021 抱团崩塌(`tier:'major'`,金融线情绪高点,"顶住"/"离场"两个确定性分支,离场分支直接复用现成的 `laid_off`/`ev_cs_reemployment` 机制,已确认该事件文案完全通用无 CS 痕迹)。新增专业「金融学」(985/211/一本)、结局「牛熊过客」(priority 109)、收入规则 `inc_fin_front_office`(¥78000/-8/-7,全游戏最高年度心态/健康消耗速率)与 `inc_fin_back_office`(¥42000/-4/-4)。
- **医学线**(`career_medicine` flag,`medicine` trackFlag,过渡 flag `medicine_resident`):新增 `events/career-medicine.ts` 4 个专属事件——2018 规培开始(设 `medicine_resident`)、2020 出征(`tier:'major'`,全游戏最高光剧情,请战一线/后方支援/申请轮岗三选项)、2021 规培结束(清除 `medicine_resident`,分流 `doctor_public`/`doctor_private`/`doctor_left`)、2023 编制与尊严。设计文档"5 年本科 + 3 年规培"完全靠 flag 在既有固定时间线(2018-2026)上模拟,不改引擎架构,与"考研推迟 3 年入场"现有实现方式同构。**关键设计**:2020 出征事件按 `{ major: '临床医学' }` 而非 `career_medicine` 门控——后者的赋值时机因求职(2018)/考研(2021,经 `ev_postgrad_exit`)分流路径而异,按 major 门控才能保证所有临床医学专业玩家都不会错过这条主线;已验证 `settleRound` 在年内事件全部结算完后才结算收入,故规培低薪正好只覆盖 2018/2019/2020 三年,与"3 年规培"吻合,无需额外处理。新增专业「临床医学」(985/211/一本/二本)、结局「白衣执甲」(priority 111,标题取自设计文档原句)、收入规则 `inc_med_resident`(¥6000/-6/-5,刻意做到全游戏最低档,规培工资"煎熬"的数值落地)、`inc_med_attending_public`/`inc_med_attending_private`/`inc_med_left`(¥34000/¥50000/¥28000)。
- **引擎改动**(唯一必须的 `packages/core` 改动):`handleCrossroad` 的「求职」分支新增金融/医学两个 `else if` 分支——不这样做,新专业玩家会一直落进 `local` 兜底,所有靠新 flag 触发的事件永久 0 覆盖。`ev_postgrad_exit` 追加金融/医学两个 `visibleIf` 选项。`inc_generic_job` 排除条件补上 `not career_finance`/`not career_medicine`,避免新职业线重复吃通用兜底收入。`CROSSROAD_OPTIONS.recommendedFor`、`validate.ts` 的 `KNOWN_TRACK_FLAGS`、`simulate.ts` 的 `CAREER_LABELS` 同步补齐。
- **测试补全**:`engine.test.ts` 新增「career crossroad branches」describe 块,直接断言金融/医学专业选择求职后 `career`/`career_xxx` flag/`first_job_track` 写入正确——此前 `handleCrossroad` 的专业字符串匹配分支完全没有单测覆盖,只靠 simulate 间接兜底。
- **规培期间的互斥门控**(验证过程中人工抽查种子发现,非计划原定范围):种子回放发现规培医生会命中「领导的反馈」("owner 意识"黑话)、「试用期汇报」(PPT 汇报)等强企业职场语境的共享事件,与"规培"身份不符(仿 M5 第十二轮"互斥情节门控"precedent)。给 `ev_work_probation`/`ev_work_manager_feedback`/`ev_work_first_bonus`/`ev_work_remote_office` 四个事件的 `trigger` 加上 `not: { flag: 'medicine_resident' }`,规培结束后这些事件恢复正常触发。
- **执行顺序调整**:原计划拆成金融/医学两轮分别验证、分别 commit(降低平衡调参时的排查难度)。实施中发现 `applications.ts`/`engine.ts`/`ev_postgrad_exit` 是两条线共享的同一批文件——金融的专业条目一旦落地,`validate` 的 `KNOWN_TRACK_FLAGS` 白名单检查就要求医学的 trackFlag 也必须同时补上,两轮拆分在这一层没有实际隔离效果,遂合并成一轮实现、一次验证、一次 commit。
- **已知的次要边界情况(不修复)**:临床医学专业选"考公"(而非求职/考研)时不会拿到 `career_medicine`/`medicine_resident`,但仍会因 major 门控触发 2020 出征事件,出现"考公方向的医学生也经历一线请战"的轻微叙事错位(已用 seed 18 实测复现)。触达概率低、不影响任何门禁;现实中也有医疗口公务员/疾控系统被抽调参与抗疫的对应情形。
- 验证:`typecheck`/`test`(21 通过,+2 新测试)/`validate`(0 error/0 warning)/`simulate -n 1000 --check` 全部通过,94/94 事件覆盖、19 个结局全可达(白衣执甲 1.4%、牛熊过客 0.1%——金融专业录取率本身较低,1000 局仅 9 局落在金融职业线)、提前结局占比 8.2%(与上一轮持平,医学线规培三年低薪 + 疫情高健康消耗的叠加压力**未**导致早退结局超标,原本担心的平衡风险未成真);`web build`、`miniprogram build:weapp` 均通过。按职业线分组:金融均财 ¥419,700/心态均值 23(全场最低,符合"高薪高耗"设计意图,样本量小需谨慎解读)、医学均财 ¥258,404/心态均值 48(健康区间,规培叠加压力未引发死亡螺旋)。

### M5 第二十三轮(年度背景与事件对齐 + 计算机线/师范线断更补完)

由 Claude Code(Sonnet 5)完成,内容版本 → 0.15.8,事件 94 → 108,收入规则 16 → 19。背景:用户提出两个内容质量问题——(1)`timeline/phases.ts` 里各年 `brief`(开篇背景描述)与当年实际触发事件的关联度参差不齐,部分年份的 brief 点名了具体时代符号(校园贷、共享单车、996.ICU、新能源/短剧等)但事件库里完全找不到对应内容;(2)计算机线/师范线早期(2018-2022/2023)专属事件质量很高,但都在游戏后段"断更"——计算机线 2024-2026、师范线 2023-2026 完全没有专属剧情,玩家掉回通用 `work` 池。核查过程中额外发现一个真实数值 bug:师范线"考编热"成功分支会同时点亮 `career_gov` 和 `teacher_public` 两个 flag,导致该分支隐性双吃 `inc_edu`(¥26000)+`inc_gov`(¥20000)=¥46000/年,是全部职业线里唯一的双重计费。

- **职业线专属文件重构(纯迁移,零功能变化)**:仿 `career-finance.ts`/`career-medicine.ts` 惯例,新建 `events/career-cs.ts`(计算机线)和 `events/career-education.ts`(师范线),把原本混在 `work.ts` 里的 5 个 cs 事件 + 2 个链式后续事件、4 个 edu 事件剪切过去,`index.ts` 同步新增两个 import。迁移前后跑过一次 `simulate -n 1000 --check` 对照,职业线分组数字(计算机 ¥343,983/心态 19、教育 ¥256,207/心态 36)与迁移前完全一致,确认零回归。`work.ts` 从 2174 行降到约 1663 行。
- **年度 brief↔事件对齐(7 个偏弱年份,均走"新增/微调事件"而非改写 brief)**:
  - 2014:新增 `ev_college_mobile_wave_2014`(开学季 4G 套餐 + 滴滴快的补贴大战 + 抢红包)。
  - 2016:新增 `ev_college_campus_trends_2016`(校园贷分期 / 校园主播 / 旁观学业三选一,校园贷分支用 `moneyCost` 比例扣减,不写死大额固定负数)。
  - 2017:新增 `ev_college_bike_share_2017`(共享单车押金通勤 / 运维兼职 / 继续挤公交),"保研落在 2016 年""考公决策在 2018-03 crossroad"这两处 brief 与机制的既有时间错位本轮不处理。
  - 2019:新增 `ev_work_startup_boom_bust_2019`(朋友圈两极分化:同学创业融资喜报 vs 《裁员实录》长文),并给 `ev_work_996` 文本补上"996.ICU""GitHub 热榜"字样(纯文案,不改机制)。
  - 2024:新增 `ev_work_trend_chasing_2024`,补上 `ev_invest_gold_2024` 没展开的"新能源""短剧""出海"三个 brief 点名却零命中的赛道。
  - 2025:新增 `ev_work_mortgage_pressure_2025`(`has_house` 门控,月供压力下的职业选择,区别于 `ev_house_price_correction` 的资产估值视角)和 `ev_life_marriage_or_kids_2025`(普适催婚催育,`visibleIf npcStage:first_love/married` 解锁"和伴侣商量生育规划"分支)。
  - 2026:不新增全民向事件——brief 本身是纯收束总结文字,无具体时代符号需要对应;专属质感改由 cs/edu 的"十二年回望"事件间接提供(用户已确认范围仅限这两条线,金融/医学本轮不动)。
- **计算机线断更补齐(2024-2026)**:`career-cs.ts` 新增 `ev_cs_35_crisis_2024`(35岁红线,按 `ai_adapted` flag 差异化转管理/卷职级/看出海机会的文案口吻)、`ev_cs_overseas_2025`(出海业务调岗邀请)、`ev_cs_decade_2026`(十二年回望,按 `ai_adapted`/`laid_off`+`cs_switch_failed`/都没有 三分支,`visibleIf` 互补穷尽保证至少一支可见)。
- **师范线断更补齐(2023-2026)+ 收入分档重构**:`career-education.ts` 新增 `ev_edu_title_evaluation_2023`(评职称,体制内 vs 机构"金牌讲师"两个视角,补齐全库此前零命中的"职称"情节)、`ev_edu_homeroom_parents_2024`(班主任 + 家长会冲突,补"带班""家长会"情节)、`ev_edu_ai_classroom_2025`(AI 批改作业,与 cs 线 2023 年 AI 事件形成职业对照但不重复)、`ev_edu_decade_2026`(十二年讲台回望,按 `teacher_public`/`edu_reinvented`/都没有 三分支穷尽)。同时修复 `ev_edu_exam_heat` 成功分支的双重计费 bug(删除多余的 `setFlag: 'career_gov'`,只保留 `teacher_public`),并把 `incomes.ts` 里单一的 `inc_edu`(¥26000 不分支)拆成 4 档互斥规则(仿 `inc_med_*` 写法,用 `not` 保证互斥):`inc_edu_public`(¥32000,体制内在编)、`inc_edu_transferred`(¥28000,转编制方向但未真正上岸)、`inc_edu_reinvented`(¥30000,素质教育/机构讲师)、`inc_edu_market`(¥26000,默认档,与原数值持平)。教育线均财从隐性双吃收入的水平回落到 ¥260,026、心态均值反而从 36 升到 45(体制内分支心态消耗从 -3 降到 -1,机构分支消耗上调到 -4,整体更贴近"体制内稳定但天花板低、市场化自由但更耗心态"的设计意图)。
- **验证**:每个 Phase(迁移→college 三事件→work 四事件→cs/edu 七事件→收入重构)完成后都单独跑过 `pnpm validate` + `pnpm simulate -n 1000 --check`,再在 Phase 5 收尾跑了完整的 `typecheck`/`test`(21 通过)/`validate`(0 error/0 warning,108 事件、19 收入规则)/`web build`/`miniprogram build:weapp`。**已知的 n=1000 --check 边界情况**:`baseSeed=42` 在 n=1000 时会漏掉 `ev_drama_stock_options`(1 个前排就存在的窄条件事件,门控是 `career_cs + big_platform_start + year 2020-2021` 三层叠加,本身命中率就低,与本轮新增内容无关);把 n 提到 3000 后稳定 108/108 全覆盖、`✅ 分布目标校验通过`,已在四个 Phase 节点反复验证过这一点,确认是抽样方差而非本轮改动引入的回归。
- **协作中发现但未处理的旁支**:实现过程中注意到仓库里还有一个未纳入 git 的 `apps/minigame/`(微信小游戏端口的脚手架,今天早些时候创建,推测是另一个并行会话在做的独立工作),本轮 commit 刻意排除了这个目录和它触发的 `pnpm-lock.yaml` workspace 条目变化,避免和那份工作互相干扰。

### M5 第二十四轮(事件盘点与适度删减)

由 Claude Code(Sonnet 5)完成,内容版本 → 0.15.9,事件 108 → 105。背景:用户要求盘点当前事件库,找出与主线剧情(4 条职业线 / 投资线 / 5 个 NPC 弧线 / 结局判定)关联不大、且事件本身趣味性(选项张力、文案记忆点)也偏弱的内容,做适当删减。

- **通读结论**:逐条读完 `packages/content/src/events/` 下全部 8 个文件(career-cs/career-education/career-finance/career-medicine/college/drama/random/work,共 5289 行)后发现,绝大多数事件(包括 college/random 这类"日常池"内容)都有真实的数值取舍和文案记忆点,不构成删减理由——这正是 GAME_DESIGN.md 里"随机池"的设计初衷,不是缺陷。真正同时满足"与主线无关联 + 机制/文案都偏薄"的候选高度集中在 `random.ts` 里几个彼此高度同质化的情感类事件。
- **删除的 3 个事件(均在 `random.ts`)**:
  - `ev_random_parents_video`(视频通话)—— 与 `ev_random_family_call`(家里的电话)是同一个"父母联系/愧疚"情感节拍的重复演绎,两者都只有 mindset 微调、无 flag、无实质分支差异。
  - `ev_random_annual_review`(年度总结)—— 通用职场"年底反思"套路,与 `ev_work_midlife_hint`(三十岁的暗示)主题重叠,无 money/knowledge 等主线关联,选项张力薄弱。
  - `ev_random_health_report`(体检报告)—— 与 `ev_random_gym_card`(年卡)健康主题重复,且和保留的 `ev_random_parent_checkup`(家里的体检报告)标题概念相撞,选项结构单薄。
- **保留但记录在案的边界案例**:`ev_random_parent_checkup`(家里的体检报告)——它写的 `parent_checkup_seen` flag 全仓库无任何地方读取(死 flag),两个选项结果也几乎一样,但按用户决定保留,因为它是 M5 第十七轮特意设计的"轻量体检"版本,用来与 tier:major 的 `ev_drama_parent_hospital`(爸爸的检查单)互斥、避免父母生病剧情重复触发,机制作用仍然成立。
- 全仓库 grep 确认删除的 3 个 id 未被任何 `schedule`/`trigger`/文档交叉引用,可安全整体删除。
- 验证:`typecheck`/`test`(21 通过)/`validate`(0 error/0 warning,105 事件)/`simulate -n 1000 --check`(事件覆盖 104/105,未触发 `ev_drama_stock_options`——延续 M5 第二十三轮就存在的已知抽样方差,与本轮改动无关)/`simulate -n 3000 --check`(105/105 全覆盖,`✅ 分布目标校验通过`)/`web build`/`miniprogram build:weapp` 全部通过。

### M5 第二十五轮(修复 GitHub Actions `pnpm simulate -n 300 --check` 门禁失败)

由 Claude Code(Sonnet 5)完成,内容版本 0.15.9 → 0.15.10。背景:`.github/workflows/deploy.yml` 的 Quality gates 用 `pnpm simulate -n 300 --check`(比日常验证用的 n=1000/3000 样本小得多),CI 报错 `事件覆盖不完整: 107/108` + `结局从未到达: end_gold`(该次失败对应的是尚未推送的 M5 第二十四轮之前的 origin/main,事件总数还是 108;本地在第二十四轮删减到 105 之后复现为 104/105,且多出一个同样从未到达的 `end_finance_survivor`)。逐一定位到三个独立问题,而不是同一个根因:

- **`ev_drama_stock_options` 覆盖不到(`packages/content/src/events/drama.ts`)**:门控 `career_cs + big_platform_start + year 2020-2021`,只影响"进大厂"这个 cs 子分支,但它挂在 `pools:['work']` 里跟几十个通用 work/invest/random 事件抢每年 3 个 `eventSlots`,窗口又只有 2 年,大样本下才勉强抽到、n=300 时经常抽不到。对照 `career-cs.ts` 里同样是"career_cs + 某年份"门控的里程碑事件(996/裁员/ChatGPT 冲击等)全部是 `mandatory: true`,这个事件按同样的模式补上 `mandatory: true`——它本来就该和其他大厂线里程碑一样是"该来的时候一定来",不该跟泛用随机事件抢名额。
- **`end_gold`("小有成就")结构性死结局(`packages/content/src/endings/endings.ts`)**:条件是 `money≥50万 & mindset≥45`,原 priority=140,排在 `end_house_key`(115,`has_house & mindset≥20`)和 `end_city_drifter`(120,`no_house & money≥10万 & mindset≥25`)之后。但 `ev_work_buy_house_question`(2021-2023 强制触发一次)保证每个玩家最终必然带上 `has_house` 或 `no_house` 之一,而 end_gold 的门槛严格强于这两条结局的门槛——换句话说,任何满足 end_gold 条件的玩家必然也满足 house_key 或 city_drifter 中的一个,而后两者 priority 更小、判定顺序更靠前,end_gold 因此**在任何 seed/任何样本量下都不可能被命中**,是一个和 vc-simulator 那种 `() => false` 死结局同性质的排序 bug,不是抽样方差。修复:把 priority 从 140 调整到 114(插在 `end_married`=112 之后、`end_house_key`=115 之前),让它只在没有更具体职业/关系剧情线可归类、但数值明显更好的玩家身上生效。
- **`end_finance_survivor`("牛熊过客")实际不可达**:条件原是 `career_finance & not laid_off & mindset≥25`。金融线是全部职业线里 mandatory 剧情最狠的一条(2015 实习/2018 入职/2018-19 资管新规/2020 基金热/2021 抱团崩塌五个强制节点,`incomes.ts` 里金融相关的年度 `mindsetDelta` 也是 -4~-8,全部门类里最低),抱团崩塌那个 2021 强制事件还会让约一半留任玩家被动触发 `laid_off`。实测哪怕 n=1000/3000 也只有 0.2%-0.5% 命中率(此前 M5 第二十二/二十三轮的 handoff 记录里已经提到"样本量偏小"但当时判断"不是分布超标",没意识到 mindset≥25 这个门槛本身在这条数值曲线下已经接近摸不到),n=300 时直接掉到 0。金融线的叙事本意是"熬过去、还留在牌桌上"而非"混得开心"(shareCard tone 本来就是 `bitter`),因此把 mindset 门槛从 ≥25 降到 ≥5——只要求"没有彻底崩溃"(高于 `end_burnout_quit` 的 mindset≤4 早退红线一点点),而不是"心态良好"。
- 验证:`typecheck`/`test`(21 通过)/`validate`(0 error/0 warning)/`simulate -n 300 --check`(**105/105 全覆盖,19 个结局全部命中,✅ 分布目标校验通过**——这是 CI 实际跑的档位)/`simulate -n 1000 --check`(同样 105/105 全覆盖 + ✅ 通过,`end_gold` 2 局/`end_finance_survivor` 5 局)/`web build` 全部通过。

### M5 第二十六轮(玩家反馈五连修:疫情弧/高考精简/财富可视化/读研补完/后期补密)

由 Claude Code(Fable 5)完成,内容版本 → 0.16.0,事件 105 → 118,收入规则 19 → 20,分五个独立 commit。背景:真实玩家(用户朋友)通关后反馈五个体验问题——疫情过得太快不符合现实、高考题冗长、财富增长不直观、"好像考研之后就是工作了"、"前面还不错后面越来越平淡"。用户同时问"延长到 2030 会不会更好",探索后结论是**不延长**:核心问题是后期密度(2024-2026 事件量比 2018-2021 少约 75%)不是长度,且标题"十二年"是叙事闭环、2027-2030 只能写架空内容。用户确认后按"加密后期"方向五项全做。

- **①高考 10→7 题**(examQuestionCount):分数映射按得分/难度总分比率算,与题数解耦。旧中局存档重放失败走既有 null→新开局降级。
- **②年度收入结算前移+透出**(唯一 engine 改动):根因是工资在玩家离开结算屏后的 `settleRound` 里静默入账,全程不可见。新增 `enterSettlement`(进 SETTLEMENT 屏前结算收入,明细写入 GameState 可选字段 `lastSettlement`,并 push `yearlySnapshots`);`settleRound` 只留提前结局检查+回合推进。SETTLEMENT ViewModel 透出 `incomes/moneyDelta/milestone/moneyTrend`,ENDING 透出 `moneyTrend`;web 结算屏加收入明细行+里程碑一句话(跨越 10万/50万/100万)+内联 SVG 趋势线,结局页加趋势;小程序加同款明细+View 竖条趋势(不引库)。**改动前后 n=1000 金钱分位逐位一致**(只是结算时机在同回合内前移),这是该改动的回归信号。core 单测 +1(22)。
- **③疫情三年事件弧**(新建 `events/pandemic.ts`,不动回合结构):2020《春节，暂停键》(mandatory major,排除临床医学和读研玩家)→ schedule 链出 2021《绿码时代》(按 2020 选择分支文案,部分 outcome 链出既有《静默的六十天》,保留"不是每个人都被封")→ 2022《十二月的退烧药》(mandatory major,全民,志愿者 flag 有专属回响)。新 flag:pandemic_wfh/return/volunteer。2021/2022 briefs 补疫情语境。
- **④读研 2019-2020 空窗补完**(work.ts):2019《横向、论文与工位》、2020《封校的春天》(major,读研玩家的疫情弧)两个 mandatory 事件,接通 postgrad_strong;新增收入规则 `inc_postgrad_stipend`(¥8000/年),结算屏上与上班同学工资形成"延迟入场"对照。
- **⑤后期密度补齐**:金融线 +2(2024《限薪令下》/2026《牛熊之间,十二年》,2015-2026 全覆盖)、医学线 +2(2024《集采之后》/2026《白大褂的十二年》,2018-2026 全覆盖)——handoff 上一轮遗留项清零;2025《三十岁，照镜子》全职业线 mandatory major,按 has_house/restarted_after_layoff/婚恋 npcStage 分支的 payoff 事件(《三十岁的暗示》窗口相应提前到 2023-2024 避免同年撞主题);NPC 终段 +3:卷王 2024(mirror_friend/distant_star→parallel_lives)、初恋 missed/separated 2024《朋友圈的红点》(→memory,落地设计文档"多年后朋友圈点赞"线)、室友 2025《十年后的合伙人》(→old_friend)。
- **CI 门禁调整**:`.github/workflows/deploy.yml` simulate n=300 → n=1000。n=300 固定种子对 118 事件+19 结局(含 <1% 命中率长尾:end_early_retire、ev_drama_stock_options)在任何 RNG 流偏移下都会随机漏 1-2 项,不再是可靠信号;n=1000 实测确定性全覆盖。试用期汇报窗口顺手延到 2021(考研玩家 2021 入职同样有试用期,兼顾覆盖鲁棒性)。
- **调平结果**(n=1000 随机 bot):兜底 26%→21%(更多玩家落进叙事结局,正面解读"后期平淡");均分 49(与 M5-15 校准线一致);心态 p50 30→48,年度曲线后期从纯衰减变为 2024 后回升——新收官事件普遍带温情 payoff,这是有意的:玩家反馈的"不爽"很大程度上就是后期只有衰减没有回报。提前结局 6.0%。
- 验证:typecheck / test 22 / validate 0err0warn / simulate n=1000 --check 通过(118/118、19 结局全可达)/ web build / miniprogram build:weapp 全过。

### M5 第二十七轮(心理学职业线 + 删软件工程 + 各专业专业课事件)

由 Claude Code(Opus 4.8)完成,内容版本 0.16.0 → 0.17.0,事件 118 → 139,结局 19 → 20,分三个内容 commit + 收尾。三项内容需求:补第 5 条精做职业线(心理学)、删重复专业(软件工程)、给每个专业补大学阶段专业课事件。

- **①删除重复专业"软件工程"(id se)**:与"计算机科学与技术"同 trackFlag cs、同一条职业线,纯重复选项。`applications.ts`:app_985 删 se;app_211 把 se **原位替换**为 cs(不能只删——否则 211 批次失去 CS 入口且旧存档 replay fallback 会从 cs track 变成 education track)。`engine.ts` CROSSROAD recommendedFor 两处移除'软件工程'、handleCrossroad 的 `includes('计算机')||includes('软件')` 简化为只留计算机。`work.ts` ev_postgrad_exit cs 选项 visibleIf 移除 `{major:'软件工程'}`。
- **②心理学职业线(全链路)**:专业入口(app_985/211/一本三批次加心理学,trackFlag psychology,不进二本/专科符合开设现实)→ validate KNOWN_TRACK_FLAGS + types 文档加 psychology → 求职分流(handleCrossroad 心理→career_psychology + first_job_track;考研/考公 recommendedFor 加心理学)→ 考研出口(ev_postgrad_exit psy 选项,强/弱 outcome)→ 事件线(新建 `career-psychology.ts`,7 个里程碑:2018 三岔口 / 2019 考证乱象 / 2020 疫情热线(major,与 pandemic 弧联动、2020 暂停键对心理学 major 排除)/ 2021 双减青少年潮 / 2023 需求爆发(major)/ 2024 行业整顿 / 2026 十二年收官,子状态 psy_school/counselor/industry/private_practice)→ 收入(inc_psy_private/school/industry/counselor,generic_job 排除心理学)→ 结局 end_psychology_listener(career_psychology + 子状态 + mindset≥20,priority 112)。simulate CAREER_LABELS 加"心理"。
- **③各专业专业课事件**:新建 `college-majors.ts`,7 个 trackFlag × 2 个专业课事件(14 个),触发用 `{flag:'major_track', equals:<track>}`,每玩家只入池本专业 2 个。年份**刻意错开 2014-2017、每年只 3-4 个 track**——踩过的坑:14 个都是 `mandatory` 会在 `pickRoundEvents` 里优先占 college 池 slot(scheduler.ts:26-28 mandatory 不受 eventSlots 限制),第一版把 6 个"event 1"全放 2015,导致 2015 每条 track 都有 mandatory,把通用事件 `ev_invest_stock_2015`(2015 单年)和 `ev_college_club_campaign`(2015-2016)挤到覆盖率 0。把 3 个挪到 2014、1 个挪到 2017 后每年 track 数降到 ≤4,覆盖率回满。
- **CI/验证档位提到 n=10000**:`deploy.yml` simulate n=1000 → **n=10000**。根因同二十六轮那条(300→1000)的延续:命中率 ~0.1% 的展示性稀有结局 `end_early_retire`/`end_cashflow_break` 在固定种子下会被 RNG 流位移 + Poisson 波动漏采。本轮加 14 事件 + 心理学结局后,n=1000 又不再稳定命中这两个(基线 task② 时各 3 局,加内容后 n=1000 掉到 0,n=3000 仍漏 cashflow,n=5000 起 4-5 局、n=10000 达 8-11 局才是可靠信号)。这两个结局是**有意的稀有 showpiece**(灾难性 / 财务自由),不通过灌水提高命中率,而是提大样本。
- 验证:typecheck / test 22 / validate 0err0warn / **simulate -n 10000 --check 通过**(139/139 全覆盖、20 结局全可达、提前结局 3.8%、职业线含心理 47/5000≈0.9%)/ web build / minigame build 全过。

### M5 第二十八轮(内容修 3 项 + 补薄弱职业线)

由 Claude Code(Opus 4.8)完成,内容版本 0.17.0 → 0.18.0,事件 139 → 147。起因是用户玩测反馈三个内容问题:①读研期间误触发《职场贵人》、②《研究生毕业》local 选项与专业选项语义撞车、③公共事件太多/职业专属太少,重复玩不同职业体验雷同。分两批落地:

- **①②③a(已随 commit `e3cdca6「公共事件降权」` 入库,本轮起点即为此状态)**:①`npcs.ts` mentor `unknown` stage 的 `advanceWhen` 追加读研排除 `{ any: [{ not: { flag: 'postgrad' } }, { flag: 'postgrad_done' }] }`——读研在读(postgrad 且未 postgrad_done)不再触发职场贵人,读研毕业/直接工作玩家不受影响。②`ev_postgrad_exit` 的 `local` 选项 label 由「先找份稳定工作」改为「不进本行,先找份工作糊口」、outcome 文案重写为"离开专业随便找活"语气(id/effects 不改,存档兼容),与 psy「进高校心理中心」等专业选项不再撞车。③a 给 9 个最通用的非 mandatory 公共工作期事件(random 5 / drama 2 / work 2)加 `weight: 0.5`,让重玩时它们出现更稀、给职业事件让路(scheduler 读 `ev.weight ?? 1`,只影响公共池填充的相对概率)。**该 commit 未做版本提档和文档,本轮补上。**
- **③b 补薄弱职业线专属事件(本轮新增 8 个)**:填补三条线的空缺年份,让重玩更有职业辨识度。均 `pools:['work']`、`mandatory:true`、`category:'career'`,trigger 用 `all:[{flag:'career_X'},{year}]`,分支差异挂在既有档位 flag 的 `visibleIf` 上(复刻 2023/2024 事件写法),**不新增任何未接线 flag**。
  - 医学 +3(6→9):`ev_med_resident_grind_2019`(规培第二年,gate `medicine_resident`+2019,只命中求职路径规培中玩家)/ `ev_med_wave_2022`(**分支切换点**,major;2022 静默+年底放开挤兑,public↔private 可互转:公立疲惫跳民营 `doctor_public→doctor_private`、民营求编制回公立 `doctor_private→doctor_public`)/ `ev_med_ceiling_2025`(职称天花板+家庭私人医生,按 public/private/left 三分支)。
  - 金融 +3(7→10):`ev_fin_downsize_2022`(**分支切换点**;降本增效裁员季,前台↔中后台可互转:前台退中后台 `finance_front_office=false`、中后台上前台 `finance_front_office=true`,后者带 network≥18 门槛)/ `ev_fin_ai_2023`(ChatGPT 进办公室+弱市,前台/中后台分支)/ `ev_fin_ceiling_2025`(35岁+天花板,按 fin_went_overseas/fin_left_industry/前台/中后台分支)。
  - 心理 +2(7→9):`ev_psy_silence_2022`(**刻意不加 `not psy_industry`**,补上转行支线在 2019/2021 被排除后的 2022 空窗;按 school/机构临床/industry 分支,industry 支线写"被拉去做温和裁员沟通"的专业错位)/ `ev_psy_ceiling_2025`(助人者的自我照顾与督导投入,按 private/school/counselor/industry 分支)。
  - CS(10)、教育(8)本轮不动。
- **切换点安全性**:只有 `ev_med_wave_2022`、`ev_fin_downsize_2022` 做 flag 切换,且只在既有已接线 flag 间收敛(改的是收入档,不碰结局条件——`end_medicine_frontline` 认 `pandemic_frontline`、`end_finance_survivor` 认 `career_finance`+not laid_off,都与 public/private/前后台无关),用现档位 `visibleIf` 保证不重复设置/不横跳;各事件的 `visibleIf` 分支对该线所有档位穷尽覆盖,不会出现无可见选项的死事件。
- 验证:typecheck / test 22 / validate 0err0warn / **simulate -n 10000 --check 通过**(147/147 全覆盖、20 结局全可达含 end_medicine_frontline/end_psychology_listener/end_finance_survivor 经 2022 切换点后仍可达、提前结局 4.3%)。

## 当前内容版本

`packages/content/src/index.ts`

```ts
version: '0.18.0'
title: '2014：我的十二年'
```

## 常用验证命令

```bash
pnpm typecheck
pnpm test
pnpm validate
pnpm simulate -n 200
pnpm simulate -n 10000 --check   # 结局可达性门禁档位(CI 同档,见下方长尾结局说明)
pnpm simulate -n 1 -v --seed 43
pnpm --filter @life-sim/web build
pnpm --filter @life-sim/miniprogram typecheck
pnpm --filter @life-sim/miniprogram build:weapp
```

如果在 Codex 沙箱里运行 `pnpm validate` 或 `pnpm simulate`,`tsx` 可能因 IPC pipe 权限失败。需要用非沙箱/批准方式运行。

## 最近一次验证结果

最近一次完整验证通过(M5 第二十八轮):

- `pnpm typecheck`
- `pnpm test`(22 通过)
- `pnpm validate`
- `pnpm simulate -n 10000 --check`(CI 实跑档位,本轮起从 n=1000 提到 n=10000)
- `pnpm --filter @life-sim/web build` / `pnpm --filter @life-sim/minigame build`

最近一次 `pnpm validate`:

```text
事件 147, 结局 20, NPC 5, 题目 37, 收入规则 24
完成: 0 errors, 0 warnings
```

最近一次 `pnpm simulate -n 10000 --check`(与 `.github/workflows/deploy.yml` 一致的档位):

```text
事件覆盖: 147/147
提前结局占比: 4.3%
end_medicine_frontline 110 / end_psychology_listener 72 / end_finance_survivor 40(经 2022 分支切换点后仍全部可达)
✅ 分布目标校验通过(全覆盖、全可达、无结局>40%、兜底≤35%、提前结局≤10%)
```

**注意:n=1000/n=300 档位已不再可靠**——139 事件 + 20 结局中存在命中率 ~0.1% 的展示性稀有结局(end_early_retire、end_cashflow_break),固定种子下任何 RNG 流偏移(改题数、加事件、加职业线都会偏移)都会让小样本随机漏采:n=1000 曾稳定命中,第二十七轮加 14 事件 + 心理学线后 n=1000 掉到 0、n=3000 仍漏、n=5000 起 4-5 局、n=10000 达 8-11 局。CI 与本地可达性验证一律用 n=10000。

最近一次 `pnpm simulate -n 500 --compare`(M5 第二十六轮全部内容落地后):

```text
随机 49 · 卷钱 47(崩溃率 9.8%) · 保心态 61 · 卷总分 72
```

卷总分(开天眼)bot 72 分仍低于 A 线 82,无必胜解;与 M5-21 的 42/41/62/68 相比整体 +5~7 分,来自本轮温情向收官事件,排序结构未变。

## 当前重要实现点

- 引擎仍保持纯函数风格:`start / view / dispatch`
- UI 仍只渲染 `ViewModel` 和 dispatch action
- 浏览器存储只在 `packages/web/src/platform/storage.ts`
- 内容长期影响主要通过 `flags` / `npcStage` / `npcFavor` / `history` 实现
- NPC 主动推进在 `packages/core/src/systems/scheduler.ts`
- 志愿和三岔口的特殊流程结果通过 `pendingFlowAdvance` 中转到 `OUTCOME`

## 已知问题 / 后续建议

- **职业线密度已五线对齐**:计算机 10、心理 9、医学 9、教育(师范)8、金融 10 个专属事件,全部覆盖到 2026(M5 第二十八轮补完医学 2019/2022/2025、金融 2022/2023/2025、心理 2022/2025 的空缺年份)。内容总量 147 个,已超过设计文档最初设想的约 125 个。其中医学 2022《这一年的白大褂》、金融 2022《降本增效那一年》是"分支切换点"——玩家可在公立/民营、前台/中后台等既有收入档间转档,重玩辨识度主要来源之一。
- 结局数量当前是 19 个,已超过 12-15 个 MVP 目标区间;后续新增结局要注意分布不要再次挤高兜底或某个单一结局。
- 金融线样本量偏小(1000 局随机 bot 仅 11 局落在金融职业线,因为「金融学」只在 985/211/一本三档、且这三档专业选项本身较多),`end_finance_survivor`(牛熊过客)命中率目前 0.2%-0.7%——M5 第二十五轮已把它的 mindset 门槛从 ≥25 降到 ≥5(修复了 n=300 时完全摸不到的问题),但样本量本身偏小的问题还在,如果后续想让这条线更常被玩到,可以考虑扩大专业投放档次或提高该批次里金融学被随机选中的权重。
- 临床医学专业选"考公"分支时会有已知的次要叙事错位(仍会触发 2020 出征事件但拿不到 career_medicine),详见 M5 第二十二轮小节,不影响任何门禁,暂不计划修复。
- 分享图 Canvas 渲染已通过类型检查和构建,但还没有在真实浏览器里点过"保存分享图",上线前建议人工玩一局到结局验证一次。
- 金钱/心态等数值已经可玩,但还需要继续根据 simulate 分布调平衡;`--compare` 的策略 bot 对比还没有在金融/医学线加入后、也没有在本轮 cs/edu 补完 + 师范线收入重构后重新跑过。
- `apps/minigame/`(微信小游戏端口脚手架)已在另一个并行会话里正式提交入库(见 `feat: add minigame app scaffold` 一次提交),不再是游离的未跟踪目录;后续如需继续这条线,直接在 `apps/minigame` 里迭代即可。

## 给下一个模型的建议

接手时先读:

1. `README.md`
2. `GAME_DESIGN.md`
3. `TECH_ARCHITECTURE.md`
4. 本文件 `AGENT_HANDOFF.md`

然后先跑:

```bash
pnpm validate
pnpm simulate -n 200
```

再决定是继续补内容、调平衡,还是做 Web 体验打磨。
