import { PickType } from "@nestjs/swagger";
import { User } from "../entities/users.entity";

export class CreateUsersDto extends PickType(User, [
  "username",
  "about",
  "avatar",
  "email",
  "password",
] as const) {}
