import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "../constants/roles.const";
import { PostModel } from "src/posts/entities/post.entity";

@Entity()
export class UserModel{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true
  })
  nickname: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string

  @Column({
    type:'enum',
    enum: Object.values(Role),
    default: Role.USER,
  })
  role: Role;


  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}