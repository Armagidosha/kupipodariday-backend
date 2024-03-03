import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUsersDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import { User } from "./entities/users.entity";
import { hash } from "@/common/hash/hash";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUsersDto) {
    const { password, ...user } = await this.usersRepository.save({
      ...createUserDto,
      password: await hash(createUserDto.password),
    });
    return user;
  }

  async findMany(query: unknown) {
    return await this.usersRepository.find(query);
  }

  async findOne(params: unknown) {
    return await this.usersRepository.findOneOrFail(params);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password);
    }
    return await this.usersRepository.update(id, updateUserDto);
  }
}
