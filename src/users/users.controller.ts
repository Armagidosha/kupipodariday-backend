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
import { CreateUsersDto } from "./dto/create-user.dto";
import { UserReq } from "@/common/decorators/user.decorator";
import { User } from "./entities/users.entity";
import { JwtAuthGuard } from "@/auth/guard/jwt.guard";
import { UpdateUserDto } from "./dto/update-user.dto";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get("me")
  getMe(@UserReq() user: User) {
    return this.usersService.findOne({ where: { id: user.id } });
  }

  @Patch("me")
  patchMe(@UserReq() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get("me/wishes")
  getMyWishes() {
    // return this.usersService.getMyWishes();
  }

  @Get(":username")
  getUser(@Param("username") username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Get(":username/wishes")
  getUserWishes() {
    // return this.usersService.getUserWishes();
  }

  @Post("find")
  findUsers(@Body() req) {
    return this.usersService.findMany({
      where: [{ email: req.query }, { username: req.query }],
    });
  }
}
