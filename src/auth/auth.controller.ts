import { UsersService } from "@/users/users.service";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUsersDto } from "@/users/dto/create-user.dto";
import { UserReq } from "@/common/decorators/user.decorator";
import { User } from "@/users/entities/users.entity";
import { LocalAuthGuard } from "./guard/local.guard";

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  login(@UserReq() req: User) {
    return this.authService.login(req);
  }

  @Post("signup")
  signup(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }
}
