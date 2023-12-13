import { IsIn, IsNumber, IsOptional } from "class-validator";

export class PaginatePostDto {

  // 이전 마지막 데이터의 ID보다 높은 id 가져오기

  @IsNumber()
  @IsOptional()
  where__id_more_than?: number

  // 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC'

  // 몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20


}