import type { NpcDef } from '@life-sim/core';

export const npcs: NpcDef[] = [
  {
    id: 'roommate',
    name: '创业室友',
    description: '永远在折腾新点子。你可能陪他创业，也可能只在多年后听说他的消息。',
    routeLabel: '创业共同体',
    initialFavor: 20,
    initialStage: 'freshman',
    stages: {
      freshman: {
        advanceWhen: { year: { from: 2015, to: 2015 } },
        eventId: 'ev_npc_roommate_startup_pitch',
      },
      cofounder: {
        advanceWhen: { year: { from: 2017, to: 2017 } },
        eventId: 'ev_npc_roommate_startup_reality',
      },
      observer: {
        advanceWhen: { year: { from: 2017, to: 2017 } },
        eventId: 'ev_npc_roommate_startup_reality',
      },
      distant: {
        advanceWhen: { year: { from: 2020, to: 2020 } },
        eventId: 'ev_npc_roommate_2020',
      },
      close_friend: {
        advanceWhen: { year: { from: 2020, to: 2020 } },
        eventId: 'ev_npc_roommate_2020',
      },
      livestream_comeback: {
        advanceWhen: { year: { from: 2025, to: 2025 } },
        eventId: 'ev_npc_roommate_2025',
      },
      faded: {
        advanceWhen: { year: { from: 2025, to: 2025 } },
        eventId: 'ev_npc_roommate_2025',
      },
      old_friend: {},
    },
  },
  {
    id: 'first_love',
    name: '初恋',
    description: '从大学操场开始的一段关系，可能走过异地，也可能只剩朋友圈里的红点。',
    routeLabel: '亲密关系',
    initialFavor: 10,
    initialStage: 'club_acquaintance',
    stages: {
      club_acquaintance: {
        advanceWhen: { year: { from: 2016, to: 2016 } },
        eventId: 'ev_college_confession',
      },
      together: {
        advanceWhen: { year: { from: 2018, to: 2018 } },
        eventId: 'ev_love_distance',
      },
      missed: {
        advanceWhen: { year: { from: 2024, to: 2024 } },
        eventId: 'ev_npc_first_love_2024',
      },
      separated: {
        advanceWhen: { year: { from: 2024, to: 2024 } },
        eventId: 'ev_npc_first_love_2024',
      },
      steady: {
        advanceWhen: { year: { from: 2022, to: 2023 } },
        eventId: 'ev_love_marriage',
      },
      married: {},
      // steady_long = 求婚时说“再等等”,之后感情放凉;2024 与 missed/separated 汇入同一收官事件,
      // 由 ev_npc_first_love_2024 的 steady_long 专属开场与选项承接。
      steady_long: {
        advanceWhen: { year: { from: 2024, to: 2024 } },
        eventId: 'ev_npc_first_love_2024',
      },
      memory: {},
    },
  },
  {
    id: 'grinder',
    name: '卷王同学',
    description: '你的镜像和参照物：保研、大厂、裁员，每一步都让人忍不住比较。',
    routeLabel: '竞争与镜像',
    initialFavor: 15,
    initialStage: 'freshman',
    stages: {
      freshman: {
        advanceWhen: { year: { from: 2016, to: 2016 } },
        eventId: 'ev_npc_grinder_baoyan',
      },
      big_tech: {
        advanceWhen: { year: { from: 2018, to: 2019 } },
        eventId: 'ev_npc_grinder_big_tech',
      },
      // 2018 大厂事件按早期选择分叉出的两个中期 stage,均在 2022 复用同一被裁事件:
      // caught_up = 一路并肩追赶;drifting = 渐行渐远。
      caught_up: {
        advanceWhen: { year: { from: 2022, to: 2022 } },
        eventId: 'ev_npc_grinder_layoff',
      },
      drifting: {
        advanceWhen: { year: { from: 2022, to: 2022 } },
        eventId: 'ev_npc_grinder_layoff',
      },
      mirror_friend: {
        advanceWhen: { year: { from: 2024, to: 2024 } },
        eventId: 'ev_npc_grinder_2024',
      },
      distant_star: {
        advanceWhen: { year: { from: 2024, to: 2024 } },
        eventId: 'ev_npc_grinder_2024',
      },
      parallel_lives: {},
    },
  },
  {
    id: 'hometown_friend',
    name: '县城发小',
    description: '留在家乡的老朋友。你们走向不同城市，也会在春节饭桌上互相打量。',
    routeLabel: '故乡与归属',
    initialFavor: 25,
    initialStage: 'home',
    stages: {
      home: {
        advanceWhen: { year: { from: 2015, to: 2015 } },
        eventId: 'ev_npc_hometown_spring_festival',
      },
      civil_servant: {
        advanceWhen: { year: { from: 2019, to: 2019 } },
        eventId: 'ev_npc_hometown_settled',
      },
      // 2019 上岸事件按“你是否还惦记这段情谊”分叉出的两个中期 stage,均在 2025 复用同一团聚事件:
      // settled_close = 一直保持联系;settled_distant = 客气但疏远。
      settled_close: {
        advanceWhen: { year: { from: 2025, to: 2025 } },
        eventId: 'ev_npc_hometown_reunion',
      },
      settled_distant: {
        advanceWhen: { year: { from: 2025, to: 2025 } },
        eventId: 'ev_npc_hometown_reunion',
      },
      distant: {},
      close: {},
    },
  },
  {
    id: 'mentor',
    name: '职场贵人',
    description: '需要足够人脉才会真正遇见的人，可能给你一次内推，也可能与你擦肩而过。',
    routeLabel: '职场传承',
    initialFavor: 0,
    initialStage: 'unknown',
    stages: {
      unknown: {
        advanceWhen: {
          all: [
            // 选择贵人线后仍需经营人脉,但门槛不应高到近两成玩家整局停在 unknown。
            { stat: 'network', op: '>=', value: 18 },
            { year: { from: 2019, to: 2022 } },
            // 读研在读期间(postgrad 已设、尚未 postgrad_done)不触发职场贵人;
            // 读研毕业(2021 起 postgrad_done)与直接工作的玩家不受影响。
            { any: [{ not: { flag: 'postgrad' } }, { flag: 'postgrad_done' }] },
          ],
        },
        eventId: 'ev_npc_mentor_intro',
      },
      available: {
        advanceWhen: {
          all: [
            { npcFavor: 'mentor', op: '>=', value: 20 },
            { year: { from: 2023, to: 2024 } },
          ],
        },
        eventId: 'ev_npc_mentor_test',
      },
      trusted_ally: {
        advanceWhen: { year: { from: 2025, to: 2026 } },
        eventId: 'ev_npc_mentor_advice',
      },
      transactional: {
        advanceWhen: { year: { from: 2025, to: 2026 } },
        eventId: 'ev_npc_mentor_advice',
      },
      missed: {
        advanceWhen: { year: { from: 2025, to: 2026 } },
        eventId: 'ev_npc_mentor_advice',
      },
      ally: {},
    },
  },
];
