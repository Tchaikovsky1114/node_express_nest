import { IsIn, IsNumber, IsOptional } from "class-validator";

export class BasePaginationDto {
  // import { Type } from "class-transformer";
  @IsNumber()
  @IsOptional()
  page?: number


  // 이전 마지막 데이터의 ID보다 높은 id 가져오기
  // Number로 변환
  // @Type(() => Number)
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number

  // 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC'
  // 몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20
}