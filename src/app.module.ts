import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./config/configuration";
import { typeOrmConfigFactory } from "./config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import UsersModule from "./users/users.module";
import { OffersModule } from "./offers/offers.module";
import WishesModule from "./wish/wishes.module";
import WishlistsModule from "./wishlist/wishlists.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    TypeOrmModule.forRootAsync({
      useClass: typeOrmConfigFactory,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    OffersModule,
    WishesModule,
    WishlistsModule,
  ],
  providers: [],
})
export class AppModule {}
