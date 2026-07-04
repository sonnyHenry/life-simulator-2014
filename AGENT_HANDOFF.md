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

## 当前内容版本

`packages/content/src/index.ts`

```ts
version: '0.13.0'
title: '2014:我的十二年'
```

## 常用验证命令

```bash
pnpm typecheck
pnpm test
pnpm validate
pnpm simulate -n 200
pnpm simulate -n 1 -v --seed 43
pnpm --filter @life-sim/web build
pnpm --filter @life-sim/miniprogram typecheck
pnpm --filter @life-sim/miniprogram build:weapp
```

如果在 Codex 沙箱里运行 `pnpm validate` 或 `pnpm simulate`,`tsx` 可能因 IPC pipe 权限失败。需要用非沙箱/批准方式运行。

## 最近一次验证结果

最近一次完整验证通过:

- `pnpm typecheck`
- `pnpm test`(17 通过)
- `pnpm validate`
- `pnpm simulate -n 1000 --check`
- `pnpm --filter @life-sim/web build`

最近一次 `pnpm validate`:

```text
事件 72, 结局 12, NPC 5, 题目 37, 收入规则 6
完成: 0 errors, 0 warnings
```

最近一次 `pnpm simulate -n 1000 --check`:

```text
事件覆盖: 72/72
金钱分位: p10=¥194800 p50=¥350000 p90=¥641500
心态分位: p10=23 p50=55 p90=87
提前结局占比: 6.3%
✅ 分布目标校验通过(全覆盖、全可达、无结局>40%、兜底≤35%、提前结局≤10%)
```

最近一次 `pnpm simulate -n 300 --compare`(四策略):

```text
随机 58 · 卷钱 51(崩溃率 41%) · 保心态 64 · 卷总分 76
```

## 当前重要实现点

- 引擎仍保持纯函数风格:`start / view / dispatch`
- UI 仍只渲染 `ViewModel` 和 dispatch action
- 浏览器存储只在 `packages/web/src/platform/storage.ts`
- 内容长期影响主要通过 `flags` / `npcStage` / `npcFavor` / `history` 实现
- NPC 主动推进在 `packages/core/src/systems/scheduler.ts`
- 志愿和三岔口的特殊流程结果通过 `pendingFlowAdvance` 中转到 `OUTCOME`

## 已知问题 / 后续建议

- 内容量还没有达到设计文档里的约 125 个事件,当前是 67 个。
- 结局数量当前是 12 个,已进入 12-15 个 MVP 目标区间,可再补金融/医学线专属结局。
- 分享图 Canvas 渲染已通过类型检查和构建,但还没有在真实浏览器里点过"保存分享图",上线前建议人工玩一局到结局验证一次。
- 金钱/心态等数值已经可玩,但还需要继续根据 simulate 分布调平衡。

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
