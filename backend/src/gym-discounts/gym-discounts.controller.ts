import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateGymDiscountDto } from 'src/gym-discounts/dto/create-gym-discount.dto';
import { UpdateGymDiscountDto } from 'src/gym-discounts/dto/update-gym-discount.dto';
import { GymDiscountsService } from 'src/gym-discounts/gym-discounts.service';

@Controller('gyms/:gymId/discounts')
export class GymDiscountsController {
  constructor(private readonly gymDiscountsService: GymDiscountsService) {}

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Param('gymId') gymId: string,
    @Body() dto: CreateGymDiscountDto,
  ) {
    return await this.gymDiscountsService.addGymDiscount(gymId, dto);
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':gymDiscountId')
  async update(
    @Param('gymId') gymId: string,
    @Param('gymDiscountId') gymDiscountId: string,
    @Body() dto: UpdateGymDiscountDto,
  ) {
    return await this.gymDiscountsService.updateGymDiscount(
      gymId,
      gymDiscountId,
      dto,
    );
  }

  @Roles('gym_admin', 'partner_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':gymDiscountId')
  async delete(
    @Param('gymId') gymId: string,
    @Param('gymDiscountId') gymDiscountId: string,
  ) {
    return await this.gymDiscountsService.removeGymDiscount(
      gymId,
      gymDiscountId,
    );
  }
}
