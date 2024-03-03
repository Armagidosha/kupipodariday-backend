import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./config/configuration";
import { typeOrmConfigFactory } from "./config/typeorm.config";
import { AuthModule } from './auth/auth.module';
import UsersModule from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),

    TypeOrmModule.forRootAsync({
      useClass: typeOrmConfigFactory,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
