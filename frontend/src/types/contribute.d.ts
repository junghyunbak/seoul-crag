import { contributionSchema } from '@/schemas/contribute';

declare global {
  type Contribution = z.infer<typeof contributionSchema>;
}
