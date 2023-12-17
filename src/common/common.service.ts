import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dtos/base-pagination.dto';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseModel } from './base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { HOST, PROTOCOL } from './const/env.const';
@Injectable()
export class CommonService {

  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string, // url path variable ex) /posts
    ) {
      if(dto.page) {
        return this.pagePaginate(dto, repository, overrideFindOptions)
      } else {
        return this.cursorPaginate(dto, repository, overrideFindOptions,path)
      }
  }

  private async pagePaginate<T>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    
  ) {
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string
  ) {
    /**
     * where__likeCount__more_than
     * 
     * where__title__iLike
     */
    const findOptions = this.composeFindOptions<T>(dto)

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions
    })

    const lastItem  = results.length > 0 && results.length === dto.take
            ? results[results.length - 1]
            : null;

      const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/${path}`)

      if(nextUrl) {
        for(const key of Object.keys(dto)) {
            if(dto[key]) {
              if(key !== 'where__id__more_than' && key !== 'where__id__less_than') {
                nextUrl.searchParams.append(key, dto[key])
              }
            }
          }
        dto.hasOwnProperty('where__id__more_than')
        ? nextUrl.searchParams.append('where__id__more_than', lastItem.id + '')
        : nextUrl.searchParams.append('where__id__less_than', lastItem.id + '')
      }
      return {
        data: results,
        cursor: {
          after: lastItem?.id ?? null,
        },
        count: results.length,
        next: nextUrl?.toString() ?? null,
        last: dto.take !== results.length
      }
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto
  ): FindManyOptions<T> {
    /**
     * where,
     * order
     * take
     * page
     */

    /**
     * DTO의 구조는 아래와 같다
     * 
     * {
     *   where__id__more_than: 1,
     *   order__createdAt: 'ASC
     * }
     * 
     * 현재는 where__id__more_than / where__id__less_than에 해당하는 where 필터만 사용중이지만
     * 나중에 where__likeCount__more_than이나 where__title__iLike등 추가 필터를 넣고 싶어졌을 때
     * 모든 where 필터들을 자동으로 파싱할 수 있게 기능을 구현해야 한다.
     * 
     * 1) where로 시작한다면 필터 로직을 적용한다
     * 2) order로 시작한다면 정렬 로직을 적용한다.
     * 3) 필터 로직을 적용한다면 '__' 기준으로 split 했을 때 3개의 값으로 나뉘는지, 2개의 값으로 나뉘는지 확인한다.
     *  3-1) 3개의 값으로 나뉜다면 FILTER_MAPPER에서 해당되는 operator 함수를 찾아서 적용한다. ['where', 'id', 'more_than']
     *  3-2) 2개의 값으로 나뉜다면 정확한 값을 필터하는 것이기 때문에 operator 없이 적용한다. ['where', 'id']
     * 
     * 4) order의 경우 3-2와 같이 적용한다.
     * 
     */

    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for(const [key, value] of Object.entries(dto)) {
      // ex) ['where__id__less_than, 1]

      if(key.startsWith('where__')) {
          where= {
            ...where,
            ...this.parseWhereFilter(key, value)
          }
      } else if (key.startsWith('order__')) {
          order = {
            ...order,
            ...this.parseOrderFilter(key, value)
          }
      }
    }
    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page -1): null
    }
  }

  private parseWhereFilter<T extends BaseModel>(key: string, value: any): FindOptionsWhere<T> {
    const options: FindOptionsWhere<T> = {}
      /**
       * 예를들어 where__id__more_than
       * __를 기준으로 나눴을 때만
       * 
       * ['where', 'id', 'more_than']으로 나눌 수 있다.
       */
      const splitKey = key.split('__')
      if(splitKey.length !== 2 && splitKey.length !== 3) {
        throw new BadRequestException(`where 필터는 '__'로 나누었을 때 길이가 2 또는 3이어야합니다. 문제되는 키값 ${key}`)
      }
      if(splitKey.length === 2) {
        const [_, field] = splitKey;
        options[field] = value
      }
      if(splitKey.length === 3) {
        const [_, field, util] = splitKey
        if(util === 'between') {
          const values = value.toString().split(',')
          options[field] = FILTER_MAPPER[util](values[0], values[1])
        }else if (util === 'i_like') {
          options[field] = FILTER_MAPPER[util](`%${value}%`)
        } else {
          options[field] = FILTER_MAPPER[util](value)
        }
        
      }
    return options
  }

  private parseOrderFilter<T extends BaseModel>(key: string, value: any): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};

    const splitKey = key.split('__') // ['order','likeCount']
    if(splitKey.length !== 2) {
      throw new BadRequestException(`order 필터는 '__'로 나누었을 때 길이가 2어야합니다. 문제되는 키값은 ${key}입니다.`)
    }
    const [_, field] = splitKey // [_, likeCount]
    order[field] = value // order = { likeCount: 'ASC' }

    return order
  }
}
