import { DefaultEntity } from "@/common/entities/defEntity";
import { Exclude } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  Length,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends DefaultEntity {
  @Column({ unique: true })
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @Column({ default: "Пока ничего не рассказал о себе" },)
  @ValidateIf(o => o.about !== '')
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({ default: "https://i.pravatar.cc/300" })
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @MinLength(8)
  password: string;

  // @OneToMany(() => Wish, (wish) => wish.user)
  wishes: string[] = [];

  // @OneToMany(() => Offer, (offer) => offer.user)
  offers: string[] = [];

  // @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: string[] = [];
}
