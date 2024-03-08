import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { UserWithoutPassword } from "@/common/types/user";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException("Неверное имя или пароль");
    return user;
  }
}
