import { IsString, MinLength } from "class-validator";



export class CreatePostDto {
  @IsString()
  @MinLength(10)
  title: string;

  @MinLength(10)
  content: string;
}