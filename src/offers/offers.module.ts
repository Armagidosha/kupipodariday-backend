import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Offer } from "./entities/offer.entity";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";
import WishesModule from "@/wish/wishes.module";

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), WishesModule],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [],
})
export class OffersModule {}
