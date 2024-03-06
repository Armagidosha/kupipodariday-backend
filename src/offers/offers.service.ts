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

  async create(id: number, createOfferDto: CreateOfferDto) {
    const { amount, hidden, itemId } = createOfferDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesService.findOne({
        where: { id: createOfferDto.itemId },
        relations: {
          owner: true,
        },
      });
      if (wish.owner.id === id)
        throw new ForbiddenException(
          "Нельзя вносить деньги в свои пожертвования",
        );
      if (wish.raised + createOfferDto.amount > wish.price)
        throw new ForbiddenException(
          "Нельзя пожертвовать больше, чем нужно собрать",
        );
      const wishes = await queryRunner.manager.update(Wish, itemId, {
        raised: wish.raised + createOfferDto.amount,
      });
      console.log(wishes);
      console.log(amount, hidden, itemId, id);
      await queryRunner.commitTransaction();
      return await queryRunner.manager.save(Offer, {
        amount,
        hidden,
        item: { id: itemId },
        user: { id },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      queryRunner.release();
    }
  }

  findOne(params: FindManyOptions<Offer>) {
    return this.offersRepository.findOneOrFail(params);
  }

  findAll(params: FindManyOptions<Offer>) {
    return this.offersRepository.find(params);
  }
}