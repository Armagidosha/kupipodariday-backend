import { User } from "@/users/entities/users.entity";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const UserReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
