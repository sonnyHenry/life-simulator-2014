import type { ProvinceOption } from '@life-sim/core';

export const provinces: ProvinceOption[] = [
  { id: 'prov_exam_giant', label: '高考大省(河南/山东)', scoreShift: -25 },
  { id: 'prov_metro', label: '直辖市(北京/上海)', scoreShift: 35 },
  { id: 'prov_normal', label: '普通省份', scoreShift: 0 },
  { id: 'prov_west', label: '西部省份', scoreShift: 15 },
];
