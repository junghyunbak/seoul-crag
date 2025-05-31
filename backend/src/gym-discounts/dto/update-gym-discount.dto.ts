import { PartialType } from '@nestjs/mapped-types';
import { CreateGymDiscountDto } from 'src/gym-discounts/dto/create-gym-discount.dto';

export class UpdateGymDiscountDto extends PartialType(CreateGymDiscountDto) {}
