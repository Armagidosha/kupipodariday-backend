import { DefaultEntity } from "@/common/entities/defEntity";
import { Offer } from "@/offers/entities/offer.entity";
import { User } from "@/users/entities/users.entity";
import { IsNumber, IsString, IsUrl, Length, Min } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Wish extends DefaultEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsString()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  @Min(1)
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  raised: number;

  @Column({ default: 0 })
  @IsNumber()
  copied: number;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
