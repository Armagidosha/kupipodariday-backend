import { DefaultEntity } from "@/common/entities/defEntity";
import { User } from "@/users/entities/users.entity";
import { Wish } from "@/wish/entities/wish.entity";
import { IsBoolean, IsNumber, Min } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Offer extends DefaultEntity {

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @Column()
  @IsNumber()
  @Min(1)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
