import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
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
    const wish = await this.wishesRepository.save({
      ...createWishesDto,
      owner: { id: userId },
    });
    console.log(wish);
    return wish;
  }

  async copy(wishId: number, userId: number) {
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
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(params: unknown) {
    return this.wishesRepository.findOneOrFail(params);
  }

  async findMany(params: unknown) {
    return this.wishesRepository.find(params);
  }

  async update(userId: number, wishId: number, updateWishDto: UpdateWishesDto) {
    const wish = await this.wishesRepository.findOneOrFail({
      where: { id: wishId },
      relations: { offers: true, owner: true },
    });

    if (userId !== wish.owner.id) {
      // TODO: ТУТА ТОЖЕ ЭРРОРА
      return "error";
    }

    if (wish.offers.length) {
      //  TODO: ТУТА ТОЖЕ ЭРРОРА
      return "error2";
    }
    return await this.wishesRepository.update(wishId, updateWishDto);
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: {
        owner: true,
      },
    });
    if (userId !== wish.owner.id) return; // TODO! ДОБАВИТь ЭРРОР
    return this.wishesRepository.delete(wishId);
  }
}
