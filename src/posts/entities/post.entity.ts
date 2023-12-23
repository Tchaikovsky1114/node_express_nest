import { UserModel } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel} from '../../common/base.entity'
import { IsString, MinLength } from "class-validator";
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
  @IsString({
    message: '제목은 문자열로 입력해야합니다.'
  })
  @MinLength(10,{
    message: '제목은 10글자 이상 입력해야합니다.'
  })
  title: string;

  @Column()
  @MinLength(10, {
    message: '글의 내용은 10자 이상 입력해야합니다.'
  })
  content: string;

  @Column({
    nullable: true
  })
  image?: string; // image의 위치를 저장하기 때문에 string

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
