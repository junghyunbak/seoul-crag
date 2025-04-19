/*
type Crag = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  thumbnailImageUrl: string;
  tags: string[];
  imageUrls: string[];
  offDays: Date[];
  settingDays: Date[];
  openingHours: [number, number][];
};
*/

import { cragScheme } from '@/schemas';

import { z } from 'zod';

declare global {
  type Crag = z.infer<typeof cragScheme>;
}
