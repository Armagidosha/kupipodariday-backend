import { PickType } from "@nestjs/swagger";
import { Wish } from "../entities/wish.entity";

export class CreateWishesDto extends PickType(Wish, [
  "name",
  "link",
  "image",
  "price",
  "description",
] as const) {}
