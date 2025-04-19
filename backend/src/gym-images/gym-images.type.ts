export const GYM_IMAGE_TYPES = [
  'interior',
  'exterior',
  'shower',
  'toilet',
  'thumbnail',
  'wall',
  'calendar',
] as const;

export type GymImageType = (typeof GYM_IMAGE_TYPES)[number];
