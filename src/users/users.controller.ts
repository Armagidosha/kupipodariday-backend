import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserReq } from "@/common/decorators/user.decorator";
import { User } from "./entities/users.entity";
import { JwtAuthGuard } from "@/auth/guard/jwt.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { WishesService } from "@/wish/wishes.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
  @Get("me")
  getMe(@UserReq() user: User) {
    return this.usersService.findOne({ where: { id: user.id } });
  }

  @Patch("me")
  patchMe(@UserReq() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get("me/wishes")
  getMyWishes(@UserReq() user: User) {
    return this.wishesService.findMany({
      where: { owner: { id: user.id } },
    });
  }

  @Get(":username/wishes")
  getUserWishes(@Param("username") username: string) {
    return this.wishesService.findMany({
      where: { owner: { username } },
    });
  }

  @Get(":username")
  getUser(@Param("username") username: string) {
    return this.usersService.findOne({
      where: { username },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }

  @Post("find")
  findUsers(@Body() req: { query: string }) {
    return this.usersService.findMany({
      where: [{ email: req.query }, { username: req.query }],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }
}
