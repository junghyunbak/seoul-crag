import { IsEnum, IsInt, IsString, ValidateIf, Min } from 'class-validator';

export class CreateGymDiscountDto {
  @IsEnum(['group', 'time', 'event'])
  type: 'group' | 'time' | 'event';

  @IsInt()
  price: number;

  @IsString()
  description: string;

  @ValidateIf((o: CreateGymDiscountDto) => o.type === 'group')
  @IsInt()
  @Min(1)
  min_group_size?: number;

  @ValidateIf((o: CreateGymDiscountDto) => o.type === 'time')
  @IsInt()
  weekday?: number;

  @ValidateIf(
    (o: CreateGymDiscountDto) => o.type === 'time' || o.type === 'event',
  )
  @IsString()
  time_start?: string;

  @ValidateIf(
    (o: CreateGymDiscountDto) => o.type === 'time' || o.type === 'event',
  )
  @IsString()
  time_end?: string;

  @ValidateIf((o: CreateGymDiscountDto) => o.type === 'event')
  @IsString()
  date?: string;
}
