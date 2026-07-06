import type { NpcDef } from '@life-sim/core';

export const npcs: NpcDef[] = [
  {
    id: 'roommate',
    name: '创业室友',
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
      steady_long: {},
      memory: {},
    },
  },
  {
    id: 'grinder',
    name: '卷王同学',
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
      layoff_pending: {
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
      settled: {
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
    initialFavor: 0,
    initialStage: 'unknown',
    stages: {
      unknown: {
        advanceWhen: {
          all: [
            { stat: 'network', op: '>=', value: 24 },
            { year: { from: 2019, to: 2023 } },
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
            { year: { from: 2024, to: 2024 } },
          ],
        },
        eventId: 'ev_npc_mentor_advice',
      },
      missed: {},
      ally: {},
    },
  },
];
