import { DefaultEntity } from "@/common/entities/defEntity";
import { User } from "@/users/entities/users.entity";
import { Wish } from "@/wish/entities/wish.entity";
import { IsUrl, Length } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Wishlist extends DefaultEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @JoinTable()
  @ManyToMany(() => Wish, (wish) => wish.name)
  items: Wish[];
}
