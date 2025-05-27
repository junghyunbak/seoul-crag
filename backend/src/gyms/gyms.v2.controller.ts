import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GymsV2Service } from './gyms.v2.service';
import {
  GymResponseDto,
  GymResponseWithFeedsDto,
} from './dto/gym-response-dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v2/gyms')
export class GymsV2Controller {
  constructor(private readonly gymsService: GymsV2Service) {}

  @Get()
  async findAll(@Query('feeds') feeds: boolean) {
    const Dto = feeds ? GymResponseWithFeedsDto : GymResponseDto;

    const gyms = await this.gymsService.findAll();

    return gyms.map((gym) => new Dto(gym));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('feeds') feeds: boolean) {
    const Dto = feeds ? GymResponseWithFeedsDto : GymResponseDto;

    const gym = await this.gymsService.findOne(id);

    if (!gym) {
      return gym;
    }

    return new Dto(gym);
  }
}
