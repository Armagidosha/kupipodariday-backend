import { compare } from "@/common/hash/hash";
import { UserWithoutPassword } from "@/common/types/user";
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

  async validateUser(username: string, pass: string): Promise<UserWithoutPassword> {
    const user = await this.usersService.findOne({
      where: { username },
      select: { password: true, username: true, id: true },
    });
    if (user && (await compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const { username, id } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, id }),
    };
  }
}
