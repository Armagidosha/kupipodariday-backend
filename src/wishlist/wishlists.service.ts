import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wishlist } from "./entities/wishlist.entity";
import { FindManyOptions, Repository } from "typeorm";
import { CreateWishlistDto } from "./dto/createWishlist.dto";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(id: number, createWishlistDto: CreateWishlistDto) {
    const { image, name, itemsId } = createWishlistDto;
    return await this.wishlistsRepository.save({
      items: itemsId.map((id) => ({ id })),
      owner: { id },
      image,
      name,
    });
  }

  async getAll() {
    return await this.wishlistsRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  findOne(params: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.findOneOrFail(params);
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });
    if (userId !== wishlist.owner.id)
      throw new ForbiddenException("Нельзя удалить чужие коллекции");
    return this.wishlistsRepository.delete(wishlistId);
  }

  async update(
    wishlistId: number,
    userId: number,
    updateWishlistDto: CreateWishlistDto,
  ) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });
    if (userId !== wishlist.owner.id)
      throw new ForbiddenException("Нельзя редактировать чужие коллекции");
    return this.wishlistsRepository.update(wishlistId, updateWishlistDto);
  }
}
