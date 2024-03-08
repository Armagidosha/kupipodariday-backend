import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wishlist } from "./entities/wishlist.entity";
import {
  DeleteResult,
  FindManyOptions,
  Repository,
  UpdateResult,
} from "typeorm";
import { CreateWishlistDto } from "./dto/createWishlist.dto";
import { UpdateWishlistDto } from "./dto/updateWishlist.dto";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(
    id: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const { image, name, itemsId } = createWishlistDto;
    return await this.wishlistsRepository.save({
      items: itemsId.map((id) => ({ id })),
      owner: { id },
      image,
      name,
    });
  }

  async getAll(params: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find(params);
  }

  findOne(params: FindManyOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistsRepository.findOneOrFail(params);
  }

  async remove(wishlistId: number, userId: number): Promise<DeleteResult> {
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
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<UpdateResult> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });
    if (userId !== wishlist.owner.id)
      throw new ForbiddenException("Нельзя редактировать чужие коллекции");
    return this.wishlistsRepository.update(wishlistId, updateWishlistDto);
  }
}
