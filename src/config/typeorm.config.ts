import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

@Injectable()
export class typeOrmConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get<string>("host.hostname"),
      port: +this.configService.get<number>("host.port"),
      username: this.configService.get<string>("db.username"),
      password: this.configService.get<string>("db.password"),
      database: this.configService.get<string>("db.name"),
      entities: [join(__dirname, "../**/*.entity{.ts,.js}")],
      synchronize:
        this.configService.get<string>("mode") === "dev" ? true : false,
    };
  }
}
