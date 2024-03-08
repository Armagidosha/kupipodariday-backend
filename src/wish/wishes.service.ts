import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DataSource,
  DeleteResult,
  EntityNotFoundError,
  FindManyOptions,
  Repository,
  UpdateResult,
} from "typeorm";
import { CreateWishesDto } from "./dto/createWishes.dto";
import { UpdateWishesDto } from "./dto/updateWishes.dto";
import { Wish } from "./entities/wish.entity";

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: number,
    createWishesDto: CreateWishesDto,
  ): Promise<Wish> {
    if (createWishesDto.price < 1 || createWishesDto.price > 100000)
      throw new ForbiddenException(
        "Цена должна быть больше 0₽ и меньше 100000₽",
      );
    const wish = await this.wishesRepository.save({
      ...createWishesDto,
      owner: { id: userId },
    });
    return wish;
  }

  async copy(wishId: number, userId: number): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesRepository.findOneOrFail({
        where: { id: wishId },
        select: {
          name: true,
          link: true,
          image: true,
          description: true,
          price: true,
          copied: true,
        },
      });
      wish.copied++;
      const newWish = await this.wishesRepository.save({
        ...wish,
        owner: { id: userId },
      });

      await queryRunner.commitTransaction();
      return newWish;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException("Подарок не найден");
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(params: FindManyOptions<Wish>): Promise<Wish> {
    try {
      return await this.wishesRepository.findOneOrFail(params);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException("Подарок не найден");
      }
    }
  }

  async findMany(params: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.find(params);
  }

  async update(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishesDto,
  ): Promise<UpdateResult> {
    const wish = await this.wishesRepository.findOneOrFail({
      where: { id: wishId },
      relations: { offers: true, owner: true },
    });

    if (userId !== wish.owner.id)
      throw new ForbiddenException("Нельзя редактировать чужие подарки");

    if (wish.offers.length)
      throw new ForbiddenException(
        "Нельзя редактировать подарки с пожертвованиями",
      );
    return await this.wishesRepository.update(wishId, updateWishDto);
  }

  async remove(wishId: number, userId: number): Promise<DeleteResult> {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: {
        owner: true,
      },
    });
    if (userId !== wish.owner.id)
      throw new ForbiddenException("Нельзя удалить чужие подарки");
    return this.wishesRepository.delete(wishId);
  }
}
