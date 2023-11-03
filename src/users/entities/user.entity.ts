import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Role } from "../constants/roles.const";
import { PostModel } from "src/posts/entities/post.entity";
import { BaseModel } from "src/common/base.entity";

@Entity()
export class UserModel extends BaseModel{

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