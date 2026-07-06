import type { GameEvent } from '@life-sim/core';

// 各专业的"专业课"体验事件(7 个 trackFlag × 2 个,错开在 2014-2017 大学四年)。
// 目的:让大学阶段不再是清一色的通用校园事件,四年读下来能读出专业的质感。
// 触发一律用 { flag: 'major_track', equals: '<track>' }(engine 在录取时写入),
// 每个玩家只有本专业 2 个事件进 college 池,不挤占通用事件(college 4 回合 × 3 slots)。
// 金融已有的《股灾实习》(career-finance.ts)保留不动,这里给金融另配两件专业课。
export const collegeMajorEvents: GameEvent[] = [
  // ---------------- 计算机科学与技术 (cs) ----------------
  {
    id: 'ev_college_cs_datastruct_2015',
    pools: ['college'],
    category: 'campus',
    title: '数据结构通宵',
    text: '2015年,数据结构课的大作业是手写一棵红黑树。deadline 前一晚,机房里坐满了对着报错发呆的人,空气里全是速溶咖啡和键盘声。你的程序跑起来就段错误,GDB 单步调到凌晨三点,才发现是一个指针少判了一次空。窗外天开始泛白,你保存代码那一刻,竟有点想哭。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'cs' }, { year: { from: 2015, to: 2015 } }] },
    choices: [
      {
        id: 'grind',
        text: '死磕到底,自己把 bug 抠出来',
        outcomes: [
          {
            weight: 1,
            text: '你没抄、没求助,一个人把这棵树种活了。交上去那天你困得眼冒金星,但心里踏实:调 bug 到天亮这件事,以后你还会经历几百次,而第一次靠自己扛过来的感觉,会一直垫在底下。',
            effects: [
              { stats: { knowledge: 7, mindset: 3, health: -4 } },
              { setFlag: 'cs_grinder' },
            ],
          },
        ],
      },
      {
        id: 'copy',
        text: '扛不住了,借同学的改改交上去',
        outcomes: [
          {
            weight: 1,
            text: '你借了学霸的代码,改了变量名和注释交了上去。分数是保住了,但期末机试坐进考场那天,同样的题型摆在面前,你才明白:抄来的知识,考试的时候是不认人的。',
            effects: [{ stats: { knowledge: 2, mindset: -3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_cs_lab_2016',
    pools: ['college'],
    category: 'campus',
    title: '进组还是打比赛',
    text: '2016年,大三的岔路口摆在面前:一位做机器学习的老师在招本科生进实验室打杂,同一时间,ACM 校队也在选拔集训队员,而校外的外包私活能一单赚两三千。三条路都要吃掉你全部的课余时间,只能挑一条。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'cs' }, { year: { from: 2016, to: 2016 } }] },
    choices: [
      {
        id: 'lab',
        text: '进实验室,跟着老师做项目',
        outcomes: [
          {
            weight: 1,
            text: '你成了实验室里年纪最小的那个,从跑数据、复现论文做起。听不懂的时候多,但一年下来,你的简历上第一次有了"参与国家级课题"这行字,读研的门也悄悄推开了一条缝。',
            effects: [
              { stats: { knowledge: 6, network: 4, mindset: 2 } },
              { setFlag: 'cs_lab_experience' },
            ],
          },
        ],
      },
      {
        id: 'acm',
        text: '进 ACM 集训队,刷题打比赛',
        outcomes: [
          {
            weight: 1,
            text: '你把一整年泡在算法题里,区域赛拿了个铜牌。名次不算耀眼,但那些被卡到自闭又豁然开朗的深夜,把你的代码功底磨得比同届人都硬——后来面大厂,面试官的白板题在你眼里都是老朋友。',
            effects: [
              { stats: { knowledge: 8, mindset: -2, health: -3 } },
              { setFlag: 'cs_acm_medal' },
            ],
          },
        ],
      },
      {
        id: 'freelance',
        text: '接外包私活,先赚点真金白银',
        outcomes: [
          {
            weight: 1,
            text: '你接了几个建站和小程序的私活,第一次靠写代码赚到了钱,请全宿舍撸了顿串。钱是实在的,只是做的都是重复的体力活,技术上没什么长进——你隐约觉得,这条路走窄了,但当下的进账太香了。',
            effects: [{ stats: { money: 6000, network: 3, knowledge: 1 } }],
          },
        ],
      },
    ],
  },

  // ---------------- 计算机应用 (cs_applied) ----------------
  {
    id: 'ev_college_csa_train_2014',
    pools: ['college'],
    category: 'campus',
    title: '实训课与私活',
    text: '2014年,刚进校门,你们学院的实训课就主打"就业导向":老师带着一整个班照着教程敲页面、配环境,做完一个能演示的成品就算过关。班里手快的同学已经开始在校外接建站的私活,几百块一单,比助学金来得痛快。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'cs_applied' }, { year: { from: 2014, to: 2014 } }] },
    choices: [
      {
        id: 'deep',
        text: '不满足于套模板,自己往底层多啃一点',
        outcomes: [
          {
            weight: 1,
            text: '别人交了作业就收工,你会多问一句"为什么这么写"。教程之外的原理啃起来慢,也没人给你加分,但你渐渐能把"会用"变成"会改"。班里大多数人止步于会套模板,你想成为那个能拆开重装的人。',
            effects: [
              { stats: { knowledge: 6, mindset: 2, health: -2 } },
              { setFlag: 'csa_self_taught' },
            ],
          },
        ],
      },
      {
        id: 'gig',
        text: '跟着接私活,早点把手艺换成钱',
        outcomes: [
          {
            weight: 1,
            text: '你跟着学长接单,给小店做官网、给公众号排版,一学期攒下小几千。钱和实战经验都是真的,只是接的活越来越同质,你偶尔会怕:这样敲下去,三年后自己会不会还是只会这几板斧。',
            effects: [{ stats: { money: 5000, network: 4, knowledge: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_csa_intern_2017',
    pools: ['college'],
    category: 'campus',
    title: '顶岗实习去哪儿',
    text: '2017年,临近毕业,学校统一组织顶岗实习。名单发下来,选项很现实:一边是珠三角的电子厂产线,管吃管住、工资按小时算、干的是流水线上的活;另一边是本地一家十来人的小软件公司,给的是"实习补贴",但至少每天碰的是代码。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'cs_applied' }, { year: { from: 2017, to: 2017 } }] },
    choices: [
      {
        id: 'factory',
        text: '去电子厂,先把生活费挣出来',
        outcomes: [
          {
            weight: 1,
            text: '你在产线上站了几个月,挣到了实打实的一笔钱,也第一次尝到"用时间换钱"最直接的滋味。夜班的流水线上你想得最多的一件事是:这不是你想干一辈子的活,回去之后,代码得再捡起来。',
            effects: [{ stats: { money: 8000, mindset: -3, health: -3 } }],
          },
        ],
      },
      {
        id: 'devshop',
        text: '去小软件公司,守住技术这条线',
        outcomes: [
          {
            weight: 1,
            text: '小公司没人带,活却真刀真枪:你被扔去改一个上线系统的 bug,查文档、翻别人写的烂代码,一周后居然改好了。补贴少得可怜,但你第一次知道了课堂之外真实的软件是什么样——毕业找工作时,这段经历比成绩单管用。',
            effects: [
              { stats: { knowledge: 6, network: 3, money: 1500 } },
              { setFlag: 'csa_real_project' },
            ],
          },
        ],
      },
    ],
  },

  // ---------------- 师范类 (education) ----------------
  {
    id: 'ev_college_edu_skills_2014',
    pools: ['college'],
    category: 'campus',
    title: '三笔一话',
    text: '2014年,刚入学,师范生的"教师基本功"训练就压了上来:粉笔字、钢笔字、毛笔字加一口普通话,天天要练。微格教室里,你对着摄像头试讲十分钟,回放时听见自己发虚的声音和满屏的"呃……那个……",尴尬得想钻进讲台底下。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'education' }, { year: { from: 2014, to: 2014 } }] },
    choices: [
      {
        id: 'drill',
        text: '每天雷打不动练字练课,死磕基本功',
        outcomes: [
          {
            weight: 1,
            text: '你把练字帖写秃了两支笔,试讲录像录了一遍又一遍。普通话考了二甲,粉笔字也能写得像模像样。这些功夫在同龄人眼里"没什么用",但你知道,将来站上讲台的第一分钟,靠的就是这些别人看不见的底子。',
            effects: [
              { stats: { knowledge: 5, mindset: 3, network: 2 } },
              { setFlag: 'edu_solid_basics' },
            ],
          },
        ],
      },
      {
        id: 'skip',
        text: '应付过关就行,把时间花在别处',
        outcomes: [
          {
            weight: 1,
            text: '你觉得这些是花架子,考试前突击一下就过了,课余时间拿去做兼职、谈恋爱。基本功这东西,欠的账当时不疼,等到教育实习真站上讲台那天,才知道利息有多高。',
            effects: [{ stats: { network: 3, mindset: 1, knowledge: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_edu_practicum_2017',
    pools: ['college'],
    category: 'campus',
    title: '第一次站上讲台',
    text: '2017年,教育实习,你被分到一所中学。指导老师把一节公开课交给你:四十双眼睛齐刷刷盯着你,后排还坐着来听课的几位老师。你精心备的教案,在真实的课堂里被一个学生的突然提问打乱了节奏,手心全是汗。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'education' }, { year: { from: 2017, to: 2017 } }] },
    choices: [
      {
        id: 'improvise',
        text: '顺着学生的问题,把这堂课上活',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'success',
            text: '你没有慌,反而顺着那个问题往下引,整堂课的气氛一下活了。下课铃响时有学生围上来问"老师你下次还来吗"。指导老师在评课本上写:有当老师的直觉。那一刻你确信,这就是你想干的事。',
            effects: [
              { stats: { knowledge: 5, mindset: 6, network: 4 } },
              { setFlag: 'edu_natural_teacher' },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'failure',
            text: '你被那个问题问懵了,含糊带过,后面的节奏也乱了,拖堂了五分钟。回办公室的路上你懊恼得不行。指导老师却笑着说:"第一次都这样,我当年更狼狈。"这堂搞砸的课,反而让你踏实了——原来讲台是可以慢慢练熟的。',
            effects: [{ stats: { knowledge: 4, mindset: -2, network: 2 } }],
          },
        ],
      },
      {
        id: 'byscript',
        text: '死守教案,稳稳把内容讲完',
        outcomes: [
          {
            weight: 1,
            text: '你把那个岔开的问题按住,"这个我们课后再讨论",硬是照着教案讲完了。课很完整,却也很平。指导老师点评:"知识点没漏,但你一直在念教案,没在看学生。"你记住了这句话——教书,教的从来不只是书。',
            effects: [{ stats: { knowledge: 5, mindset: 1 } }],
          },
        ],
      },
    ],
  },

  // ---------------- 工商管理 (management) ----------------
  {
    id: 'ev_college_mba_case_2015',
    pools: ['college'],
    category: 'campus',
    title: '案例大赛做 PPT',
    text: '2015年,管理学院办企业案例分析大赛,你被拉进一个五人小组。连着一周,你们泡在通宵自习室里做 SWOT、画商业模式画布、把一份 PPT 改到第十八版。有人负责查资料,有人负责美化,有人负责上台讲——你渐渐发现,一个组能不能赢,一半看内容,一半看谁在带节奏。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'management' }, { year: { from: 2015, to: 2015 } }] },
    choices: [
      {
        id: 'lead',
        text: '站出来当组长,统筹分工加上台答辩',
        outcomes: [
          {
            weight: 1,
            text: '你把散沙一样的五个人捏成了一个组,分好工、盯好进度,决赛答辩也是你上。名次拿了个二等奖,但比奖状更值钱的是:你第一次体会到"管理"不是一门课,是让一群不同的人朝一个方向使劲——这恰好是你专业该学的东西。',
            effects: [
              { stats: { network: 6, mindset: 4, knowledge: 3, health: -2 } },
              { setFlag: 'mba_leadership' },
            ],
          },
        ],
      },
      {
        id: 'support',
        text: '做好本职,把资料和 PPT 打磨到位',
        outcomes: [
          {
            weight: 1,
            text: '你不爱出风头,埋头把资料查扎实、把 PPT 做漂亮。组里少不了你这样的人,你也做得踏实。只是看着组长在台上侃侃而谈时,你心里闪过一个念头:同样是这个专业,有人天生站在聚光灯里,有人习惯待在幕后。',
            effects: [{ stats: { knowledge: 4, network: 3, mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_mba_confusion_2016',
    pools: ['college'],
    category: 'campus',
    title: '工商管理学的是什么',
    text: '2016年,大三的你陷进一种说不出的迷茫:管理学、市场营销、会计、人力资源、运营……什么都学一点,好像什么都不精。同宿舍学计算机的会写代码,学会计的能考证,轮到你被亲戚问"你们专业出来干啥",你张了张嘴,竟答不利索。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'management' }, { year: { from: 2016, to: 2016 } }] },
    choices: [
      {
        id: 'specialize',
        text: '选一个方向深扎,给自己攒硬本事',
        outcomes: [
          {
            weight: 1,
            text: '你决定不再"什么都学一点",挑了数据分析这条线,自学 Excel 高阶、SQL 和一点统计。方向一收窄,焦虑反而少了。你想通了一件事:万金油专业的破局办法,是自己给自己焊一门硬手艺。',
            effects: [
              { stats: { knowledge: 6, mindset: 3 } },
              { setFlag: 'mba_specialized' },
            ],
          },
        ],
      },
      {
        id: 'network',
        text: '不纠结课本,把时间投给社团和人脉',
        outcomes: [
          {
            weight: 1,
            text: '你想通的是另一条路:管理专业的价值不在书本,在人。你把精力投进学生会和各种活动,认识了一大帮人,组织能力练得贼溜。有人说你不务正业,但你赌的是,这个专业最终拼的就是资源和人情。',
            effects: [{ stats: { network: 7, mindset: 2, knowledge: -1 } }],
          },
        ],
      },
    ],
  },

  // ---------------- 金融学 (finance) ----------------
  {
    id: 'ev_college_fin_contest_2014',
    pools: ['college'],
    category: 'campus',
    title: '模拟盘大赛',
    text: '2014年下半年,一轮牛市的苗头刚刚窜起,券商冠名的高校模拟炒股大赛火遍校园。人人揣着一百万虚拟本金,食堂里、宿舍里满耳都是"涨停""满仓""杠杆"。你也报了名,盯着行情软件的那点绿红,第一次觉得课本上的 K 线活了过来。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'finance' }, { year: { from: 2014, to: 2014 } }] },
    choices: [
      {
        id: 'chase',
        text: '追热点满仓杠杆,冲榜前十',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'success',
            text: '你追涨追得凶,虚拟账户一路飘红,冲进了全校前二十,还被拉进了"民间高手"群。风光是真风光——只是你心里隐约知道,这波是牛市抬着你,不是你有多神。这份侥幸,一年后的股灾会替你算清账。',
            effects: [{ stats: { mindset: 4, network: 3, knowledge: 2 } }],
          },
          {
            weight: 3,
            outcomeTag: 'failure',
            text: '你追高杀低,虚拟账户几天就把"本金"亏去大半,排名一路垫底。好在亏的是假钱。这场没有代价的失手,让你早早记住了一件真事:凭运气冲上去的,迟早凭本事还回来。',
            effects: [{ stats: { mindset: -3, knowledge: 4 } }],
          },
        ],
      },
      {
        id: 'study',
        text: '当成练手,认真研究估值和基本面',
        outcomes: [
          {
            weight: 1,
            text: '你没被排行榜冲昏头,把模拟盘当成一块试验田:研究行业、算估值、写交易日志。名次不靠前,但一套自己的分析框架搭起了雏形。你隐隐感到,金融这行,活得久的人拼的不是手气,是纪律。',
            effects: [
              { stats: { knowledge: 6, mindset: 2 } },
              { setFlag: 'fin_value_mindset' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_fin_cert_2016',
    pools: ['college'],
    category: 'campus',
    title: '考证与财务建模',
    text: '2016年,金融专业的"军备竞赛"提上日程:证券从业、基金从业是入行门票,更卷的同学已经在啃 CFA 一级、练 Excel 财务建模了。招聘会上一句"持证优先"像根鞭子,抽得整个专业的人都坐不住。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'finance' }, { year: { from: 2016, to: 2016 } }] },
    choices: [
      {
        id: 'stack',
        text: '证照建模两手抓,把简历堆厚',
        outcomes: [
          {
            weight: 1,
            text: '你把从业资格证一张张考下来,又跟着网课练三大报表联动的财务模型,做梦都在拉 Excel 公式。过程枯燥,但校招时 HR 扫到你简历上那排证书和"熟练财务建模",目光会多停两秒——门票,你先攥在手里了。',
            effects: [
              { stats: { knowledge: 7, mindset: -2, health: -2 } },
              { setFlag: 'fin_certified' },
            ],
          },
        ],
      },
      {
        id: 'soft',
        text: '不迷信证书,主攻实习和人脉',
        outcomes: [
          {
            weight: 1,
            text: '你判断证书只是敲门砖,真正值钱的是实习经历和圈子,于是把精力押在找券商、基金的实习上。这条路赌的是"人脉和履历比一纸证书硬"——赌对了海阔天空,赌错了,校招季会有点被动。',
            effects: [{ stats: { network: 6, mindset: 1, knowledge: 2 } }],
          },
        ],
      },
    ],
  },

  // ---------------- 临床医学 (medicine) ----------------
  {
    id: 'ev_college_med_anatomy_2015',
    pools: ['college'],
    category: 'campus',
    title: '解剖课与背书周',
    text: '2015年,系统解剖学的期末逼近。八百多块骨骼肌肉的拉丁名、密密麻麻的神经血管走行,厚得像砖头的教材要在两周内塞进脑子。解剖楼里福尔马林的气味几个月都散不掉,同学间流传一句黑色幽默:"劝人学医,天打雷劈。"',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'medicine' }, { year: { from: 2015, to: 2015 } }] },
    choices: [
      {
        id: 'grind',
        text: '泡在解剖楼,一块骨头一根神经地啃',
        outcomes: [
          {
            weight: 1,
            text: '你把自己焊在了解剖楼和自习室,画图、编口诀、对着标本一遍遍认。背到崩溃的深夜也想过退学,但最终扛下来了。这门被无数人挂科的课,你考了高分——医学这条路的第一道筛子,你没被筛下去。',
            effects: [
              { stats: { knowledge: 8, mindset: 2, health: -4 } },
              { setFlag: 'med_solid_foundation' },
            ],
          },
        ],
      },
      {
        id: 'survive',
        text: '划重点突击,先保证别挂科',
        outcomes: [
          {
            weight: 1,
            text: '你靠着学长划的重点和考前突击,惊险飘过。分数不好看,但至少没重修。你心里清楚,医学的知识是要还的——今天背不牢的,将来站在病人床边,会以另一种方式问回来。',
            effects: [{ stats: { knowledge: 4, mindset: -2, health: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_med_clerkship_2017',
    pools: ['college'],
    category: 'campus',
    title: '第一次跟诊',
    text: '2017年,你进入临床见习,第一次穿上白大褂跟着带教老师查房。教科书上冷冰冰的"主诉""体征",忽然变成了病床上一个个具体的人:他们的疼痛、恐惧和求助的眼神。老师让你上前给一位病人做体格检查,你的手,微微在抖。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'medicine' }, { year: { from: 2017, to: 2017 } }] },
    choices: [
      {
        id: 'engage',
        text: '硬着头皮上手,笨拙但认真地问诊查体',
        outcomes: [
          {
            weight: 1,
            text: '你紧张得问诊的话都说得磕巴,查体的手法也生涩,但你一直看着病人的眼睛,认真听他讲哪里不舒服。查完房带教说:"手法能练,但你愿意好好听病人说话,这点难得。"你第一次摸到了"医生"这两个字的分量。',
            effects: [
              { stats: { knowledge: 6, mindset: 5, network: 3 } },
              { setFlag: 'med_clinical_calling' },
            ],
          },
        ],
      },
      {
        id: 'observe',
        text: '先站一旁多看多记,不急着上手',
        outcomes: [
          {
            weight: 1,
            text: '你选择先在旁边观察,把带教的每一句问诊、每一个手法都记进本子。上手的机会少了些,但你看清了临床和课本的距离有多大。回到宿舍你翻着笔记想:原来当医生,光会背书是远远不够的。',
            effects: [{ stats: { knowledge: 5, mindset: 2 } }],
          },
        ],
      },
    ],
  },

  // ---------------- 心理学 (psychology) ----------------
  {
    id: 'ev_college_psy_experiment_2014',
    pools: ['college'],
    category: 'campus',
    title: '实验课当被试',
    text: '2014年,大一的普通心理学实验课上,你们轮流当"被试"和"主试":测反应时、做视错觉、填一摞人格量表。你躺在仪器前被记录脑电的时候,忽然生出一种奇妙的感觉——你选的这个专业,居然是拿科学的尺子,去量那些最摸不着的东西。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'psychology' }, { year: { from: 2014, to: 2014 } }] },
    choices: [
      {
        id: 'science',
        text: '被实验设计迷住,往科研方向靠',
        outcomes: [
          {
            weight: 1,
            text: '你迷上了"把心理变量操作化"的这套思路,课后追着老师问统计和实验设计,还申请进了本科生科研项目。别人觉得心理学是聊天算命,你却看见了它硬核的那一面——这门专业,是有尺子的。',
            effects: [
              { stats: { knowledge: 6, mindset: 3, network: 3 } },
              { setFlag: 'psy_research_taste' },
            ],
          },
        ],
      },
      {
        id: 'people',
        text: '对数据无感,更想搞懂活生生的人',
        outcomes: [
          {
            weight: 1,
            text: '一堆量表和 SPSS 数据让你头大,你真正好奇的是人本身:他们为什么焦虑,为什么在关系里反复受伤。你把课外时间花在读咨询和人格的书上。你隐约认定,自己将来要坐的,是咨询室的椅子,不是实验室的板凳。',
            effects: [{ stats: { knowledge: 4, mindset: 3, network: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_psy_roleplay_2016',
    pools: ['college'],
    category: 'campus',
    title: '咨询技术角色扮演',
    text: '2016年,咨询心理学的课上,老师让你们两两一组做角色扮演:一个当来访者,一个当咨询师,练"共情"和"倾听"。轮到你当咨询师,面对同学半真半假讲出的烦恼,你才发现,原来"好好听人说话"这件看起来最简单的事,做起来那么难。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'psychology' }, { year: { from: 2016, to: 2016 } }] },
    choices: [
      {
        id: 'immerse',
        text: '认真投入,把每次练习当真实咨询',
        outcomes: [
          {
            weight: 1,
            text: '你把每次角色扮演都当真的做:管住想给建议的嘴,试着只是听、只是回应。有一次搭档演着演着讲起了真事,眼圈红了。那一刻你懂了,共情不是技巧,是真的坐到对方那一边去——这门手艺,你算是入门了。',
            effects: [
              { stats: { knowledge: 6, mindset: 4, network: 3 } },
              { setFlag: 'psy_counseling_aptitude' },
            ],
          },
        ],
      },
      {
        id: 'awkward',
        text: '放不开,总忍不住想给对方出主意',
        outcomes: [
          {
            weight: 1,
            text: '你一到当咨询师就别扭,对方刚起个头,你就急着分析、给建议,老师点评:"你在帮他解决问题,不是在听他。"这句话让你脸热,也让你第一次意识到,自己离"会倾听"还差得远——这一课,你记下了。',
            effects: [{ stats: { knowledge: 4, mindset: -1, network: 2 } }],
          },
        ],
      },
    ],
  },
];
