import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateOfferDto } from "./dto/createOffer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Offer } from "./entities/offer.entity";
import { DataSource, FindManyOptions, Repository } from "typeorm";
import { WishesService } from "@/wish/wishes.service";
import { Wish } from "@/wish/entities/wish.entity";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private dataSource: DataSource,
    private wishesService: WishesService,
  ) {}

  async create(id: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const { amount, hidden, itemId } = createOfferDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesService.findOne({
        where: { id: itemId },
        relations: {
          owner: true,
        },
      });
      if (wish.owner.id === id)
        throw new ForbiddenException(
          "Нельзя вносить деньги в свои пожертвования",
        );

      if (wish.raised + amount > wish.price)
        throw new ForbiddenException(
          `Нельзя пожертвовать больше, чем ${wish.price - wish.raised}₽`,
        );
      await queryRunner.manager.update(Wish, itemId, {
        raised: wish.raised + amount,
      });

      await queryRunner.commitTransaction();
      return await queryRunner.manager.save(Offer, {
        amount,
        hidden,
        item: { id: itemId },
        user: { id },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }

  findOne(params: FindManyOptions<Offer>): Promise<Offer> {
    return this.offersRepository.findOneOrFail(params);
  }

  findAll(params: FindManyOptions<Offer>): Promise<Offer[]> {
    return this.offersRepository.find(params);
  }
}
