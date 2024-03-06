import { DefaultEntity } from "@/common/entities/defEntity";
import { Offer } from "@/offers/entities/offer.entity";
import { Wish } from "@/wish/entities/wish.entity";
import { Wishlist } from "@/wishlist/entities/wishlist.entity";
import {
  IsEmail,
  IsOptional,
  Length,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends DefaultEntity {
  @Column({ unique: true })
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @Column({ default: "Пока ничего не рассказал о себе" })
  @ValidateIf((obj) => obj.about !== "")
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

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist;
}
