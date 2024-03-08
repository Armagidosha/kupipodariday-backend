import { User } from "@/users/entities/users.entity";

export type UserWithoutPassword = Omit<User, "password">;
