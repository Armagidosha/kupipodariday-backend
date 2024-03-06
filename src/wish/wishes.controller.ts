import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { UserReq } from "@/common/decorators/user.decorator";
import { User } from "@/users/entities/users.entity";
import { CreateWishesDto } from "./dto/createWishes.dto";
import { JwtAuthGuard } from "@/auth/guard/jwt.guard";
import { UpdateWishesDto } from "./dto/updateWishes.dto";

@Controller("wishes")
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UserReq() { id }: User, @Body() createWishesDto: CreateWishesDto) {
    return this.wishesService.create(id, createWishesDto);
  }

  @Get("last")
  getLast() {
    return this.wishesService.findMany({
      order: {
        createdAt: "DESC",
      },
      take: 40,
    });
  }

  @Get("top")
  getTop() {
    return this.wishesService.findMany({
      order: {
        copied: "DESC",
      },
      take: 20,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getOne(@Param("id") id: number) {
    return this.wishesService.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true
      }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  patchOne(
    @UserReq() { id }: User,
    @Param("id") wishId: number,
    @Body() updateWishesDto: UpdateWishesDto,
  ) {
    return this.wishesService.update(id, wishId, updateWishesDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  removeOne(@Param("id") wishId: number, @UserReq() { id }: User) {
    return this.wishesService.remove(wishId, id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(":id/copy")
  copyWish(@Param('id') wishId: number, @UserReq() { id }: User) {
    return this.wishesService.copy(wishId, id)
  }

}
