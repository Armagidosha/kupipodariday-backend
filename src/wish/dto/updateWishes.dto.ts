import { PartialType, PickType } from "@nestjs/swagger";
import { Wish } from "../entities/wish.entity";

export class UpdateWishesDto extends PartialType(
  PickType(Wish, ["name", "image"]),
) {
  itemsId?: number[];
}
