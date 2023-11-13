import { IsString, MinLength } from "class-validator";



export class CreatePostDto {
  @IsString({
    message: '제목은 문자열로 입력해야합니다.'
  })
  @MinLength(10,{
    message: '제목은 10글자 이상 입력해야합니다.'
  })
  title: string;

  @MinLength(10, {
    message: '글의 내용은 10자 이상 입력해야합니다.'
  })
  content: string;
}