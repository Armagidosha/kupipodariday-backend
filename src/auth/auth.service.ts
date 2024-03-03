import { compare, hash } from "@/common/hash/hash";
import { User } from "@/users/entities/users.entity";
import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      where: { username },
      select: { password: true, username: true, id: true },
    });
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const { username, id } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, id }),
    };
  }
}