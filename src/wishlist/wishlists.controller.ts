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
import { WishlistsService } from "./wishlists.service";
import { CreateWishlistDto } from "./dto/createWishlist.dto";
import { JwtAuthGuard } from "@/auth/guard/jwt.guard";
import { UserReq } from "@/common/decorators/user.decorator";
import { User } from "@/users/entities/users.entity";

@UseGuards(JwtAuthGuard)
@Controller("wishlistlists")
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getWishlists() {
    return this.wishlistsService.getAll();
  }

  @Post()
  createWishlist(
    @UserReq() { id }: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(id, createWishlistDto);
  }

  @Get(":id")
  getWishlistById(@Param("id") wishlistId: number) {
    return this.wishlistsService.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Patch(":id")
  updateWishlist() {}

  @Delete(":id")
  deleteWishlist(@Param("id") wishlistId: number, @UserReq() { id }: User) {
    return this.wishlistsService.remove(wishlistId, id);
  }
}
