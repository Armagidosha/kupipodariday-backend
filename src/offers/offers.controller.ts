import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { OffersService } from "./offers.service";
import { UserReq } from "@/common/decorators/user.decorator";
import { User } from "@/users/entities/users.entity";
import { CreateOfferDto } from "./dto/createOffer.dto";
import { JwtAuthGuard } from "@/auth/guard/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller("offers")
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  async create(
    @UserReq() { id }: User,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.create(id, createOfferDto);
  }

  @Get(":id")
  getOne(@Param("id") id: number) {
    return this.offersService.findOne({
      where: { id },
      relations: {
        item: true,
        user: {
          wishes: true,
          offers: true,
          wishlists: {
            items: true,
            owner: true,
          },
        },
      },
    });
  }

  @Get()
  getAll() {
    return this.offersService.findAll({
      relations: {
        item: true,
        user: {
          wishes: true,
          offers: true,
          wishlists: {
            items: true,
            owner: true,
          },
        },
      },
    });
  }
}
