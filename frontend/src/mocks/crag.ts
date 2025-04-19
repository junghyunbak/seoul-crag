import { faker } from '@faker-js/faker';

export const crags: Crag[] = [
  {
    id: faker.string.uuid(),
    lat: 37.5576684824211,
    lng: 126.92589313527,
    name: '더클라임 연남',
    description: `
더클라임 연남점
실내 암벽 등반
▪️ 홍대입구역 4번 출구 30초 거리!
▪️ 체계적인 커리큘럼과 전문 강사진!
▪️ 하나의 회원권으로 14개 지점을 자유롭게!
`,
    tags: [],
    thumbnailImageUrl: faker.image.avatar(),
    imageUrls: [],
    offDays: [new Date('2025-04-13')],
    settingDays: [],
    openingHours: [
      [8, 22],
      [7, 24],
      [7, 24],
      [7, 24],
      [7, 24],
      [7, 24],
      [8, 22],
    ],
  },
];
