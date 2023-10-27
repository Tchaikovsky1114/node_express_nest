import { IsString, MinLength } from "class-validator";



export class CreatePostDto {
  
  @IsString()
  author: string;

  @IsString()
  @MinLength(10)
  title: string;

  @MinLength(10)
  content: string;

  likeCount: number;

  commentCount: number;
}