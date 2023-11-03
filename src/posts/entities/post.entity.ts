import { UserModel } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BaseModel} from '../../common/base.entity'
// 테이블로 변환됨
@Entity() 
export class PostModel extends BaseModel {


  
  
  // 유저 테이블과 연동
  // ForeignKey를 통해서 UserModel과 연동한다.
  // Null이 될 수 없다.
  // ** Foreign Key는 Many의 입장에서 생성되는 key이다.
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
