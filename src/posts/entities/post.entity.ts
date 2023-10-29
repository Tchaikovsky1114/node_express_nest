import { UserModel } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity() // 테이블로 변환됨
export class PostModel {

  // 프라이머리
  @PrimaryGeneratedColumn()
  id: number;
  
  // 유저 테이블과 연동
  // ForeignKey를 통해서 UserModel과 연동한다.
  // Null이 될 수 없다.
  @ManyToOne(
() => UserModel,
   (user) => user.posts,{
    nullable: false
  })
  author: UserModel;
  
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

}
