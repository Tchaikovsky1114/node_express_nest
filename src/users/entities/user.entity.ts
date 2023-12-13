import { Column, Entity, OneToMany } from "typeorm"
import { Role } from "../constants/roles.const";
import { PostModel } from "src/posts/entities/post.entity";
import { BaseModel } from "src/common/base.entity";
import { IsEmail, IsString, Length } from "class-validator";
import { lengthValidationMessage } from "src/common/validation/message/length-validation.message";
import { stringValidationMessage } from "src/common/validation/message/string-validation.message";
import { emailValidationMessage } from "src/common/validation/message/email-validation.message";
import { Exclude } from "class-transformer";

@Entity()
// @Exclude()
export class UserModel extends BaseModel{

  @Column({
    length: 20,
    unique: true
  })
  @IsString({
    message: stringValidationMessage
  })
  @Length(2,20,{
    message: lengthValidationMessage
  })
  nickname: string;

  // @Expose()
  // get nicknameAndEmail() {
  //   return this.nickname + this.email
  // }

  @Column({
    unique: true
  })
  @IsString({
    message:stringValidationMessage
  })
  @IsEmail({},{
    message: emailValidationMessage
  })
  email: string;

  @Column()
  @IsString({
    message:stringValidationMessage
  })
  @Length(8,20,{
    message: lengthValidationMessage
  })
  /**
   * Request
   * front -> back
   * plain object (JSON) -> class instance (dto)
   * 
   * Response
   * backend -> front
   * class instance(dto) -> plain object (JSON)
   * 
   * toClassOnly -> class instance로 변환될 때만 -> Request
   * 
   * toPlainOnly -> plain object로 변환될 때만 -> Response
   */ 
  @Exclude({ toPlainOnly: true })
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