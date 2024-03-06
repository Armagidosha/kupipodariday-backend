import { Offer } from "../entities/offer.entity";
import { PickType } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateOfferDto extends PickType(Offer, [
  "amount",
  "hidden",
] as const) {
  @IsNumber()
  itemId: number;
}
