import { Column, Entity, OneToMany } from "typeorm"
import { Role } from "../constants/roles.const";
import { PostModel } from "src/posts/entities/post.entity";
import { BaseModel } from "src/common/base.entity";
import { IsEmail, IsString, Length } from "class-validator";
import { lengthValidationMessage } from "src/common/validation/message/length-validation.message";

@Entity()
export class UserModel extends BaseModel{

  @Column({
    length: 20,
    unique: true
  })
  @IsString()
  @Length(2,20,{
    message(args) {
        /**
       * ValidationArguments의 Properties
       * 1) value -> 검증 되고 있는 값 (입력된 값)
       * 2) constraints -> 파라미터에 입력된 제한 사항들(리스트로 받음)[2,20]
       * 3) targetName -> 검증하고 있는 클래스의 이름 (UserModel)
       * 4) object -> 검증하고 있는 객체
       * 5) property -> 검증 되고 있는 객체의 프로퍼티 이름 (nickname)
       */
      return lengthValidationMessage(args);
    },
      

    
  })
  nickname: string;

  @Column({
    unique: true
  })
  @IsString()
  @IsEmail({

  },{
    message: '이메일 형식이 올바르지 않습니다.'
  })
  email: string;

  @Column()
  @IsString()
  @Length(8,20,{
    message: '최소 8자, 최대 20자'
  })
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