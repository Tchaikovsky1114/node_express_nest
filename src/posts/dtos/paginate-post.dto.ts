import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { BasePaginationDto } from "src/common/dtos/base-pagination.dto";

export class PaginatePostDto extends BasePaginationDto{
  @IsNumber()
  @IsOptional()
  where__likeCount__more_than: number;

  @IsString()
  @IsOptional()
  where__title__i_like: string;

  @IsNumber()
  @IsOptional()
  where__commentCount__more_than: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__likeCount: 'ASC' | 'DESC' = 'ASC'
  
  @IsString()
  @IsOptional()
  where__title_i_like: string
}