import type { BackgroundCard } from '@life-sim/core';

export const backgrounds: BackgroundCard[] = [
  {
    id: 'bg_urban_middle',
    label: '城市中产',
    text: '父母是双职工,家里有一套房和一辆开了八年的车。他们对你的期望写在冰箱贴上:"考个好大学,找个稳定工作。"',
    initialMoney: 30000,
  },
  {
    id: 'bg_county_gov',
    label: '县城体制内',
    text: '爸爸在县里的单位上班,妈妈是小学老师。全县城的人际关系,你家都能扯上一点。他们最常说的话是:"回来考个编制,多好。"',
    initialMoney: 15000,
    flags: { hometown_connections: true },
  },
  {
    id: 'bg_rural',
    label: '农村家庭',
    text: '家里种着几亩地,爸妈农闲时去镇上打零工。你是村里这几年唯一有希望考上大学的孩子。学费,他们说"砸锅卖铁也供"。',
    initialMoney: 3000,
  },
  {
    id: 'bg_demolition',
    label: '拆迁户',
    text: '去年城中村改造,家里分了三套房和一笔现金。爸爸把存折看了又看,对你说:"咱家现在不缺钱,但你还是得有出息。"',
    initialMoney: 200000,
  },
  {
    id: 'bg_family_biz',
    label: '个体户家庭',
    text: '爸妈在批发市场开了十年的店,起早贪黑。最近他们总念叨生意不好做了——"人都跑到网上买东西去了。"',
    initialMoney: 20000,
  },
];
