import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUsersDto } from "./dto/create-user.dto";
import {
  FindManyOptions,
  QueryFailedError,
  Repository,
  UpdateResult,
} from "typeorm";
import { User } from "./entities/users.entity";
import { hash } from "@/common/hash/hash";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserWithoutPassword } from "@/common/types/user";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUsersDto): Promise<UserWithoutPassword> {
    try {
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = await this.usersRepository.save({
        ...createUserDto,
        password: await hash(createUserDto.password),
      });
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(
          "Пользователь с таким именем или почтовым адресом уже существует",
        );
      }
    }
  }

  async findMany(params: FindManyOptions<User>): Promise<User[]> {
    return await this.usersRepository.find(params);
  }

  async findOne(params: FindManyOptions<User>): Promise<User> {
    return await this.usersRepository.findOne(params);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password);
    }
    return await this.usersRepository.update(id, updateUserDto);
  }
}
