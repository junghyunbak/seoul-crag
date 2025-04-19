export const GYM_IMAGE_TYPES = [
  'THUMBNAIL',
  'SHOWER',
  'TOILET',
  'INTERIOR',
  'EXTERIOR',
  'MAP',
] as const;

export type GymImageType = (typeof GYM_IMAGE_TYPES)[number];
