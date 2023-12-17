import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserModel } from '../users/entities/user.entity';
import { PaginatePostDto } from './dtos/paginate-post.dto';
import { HOST, PROTOCOL } from 'src/common/const/env.const';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PostsService {
  constructor( 
    // @Injectable처럼 D.I에 주입가능함을 알림
    @InjectRepository(PostModel) private readonly postRepository: Repository<PostModel>,
    private readonly commonService: CommonService
    ){}

    // async getAllPosts() {
    //   return this.postRepository.find(
    //     {
    //       relations: ['author']
    //     }
    //   );
    // }

    // 오름차순으로 pagination
    async paginatePosts(dto: PaginatePostDto) {
      // const where: FindOptionsWhere<PostModel> = {
      //   id:  dto.hasOwnProperty('where__id__more_than')
      //   ? MoreThan(dto.where__id__more_than ?? 0)
      //   : LessThan(dto.where__id__less_than ?? 0),
      // }
      return this.commonService.paginate(
        dto,
        this.postRepository,
        {
          // order: {
            // likeCount: 'DESC'
          // }
          relations: ['author']
        },
        'posts'
      )
      
    }

    async generatePosts(authorId: number) {
      for(let i = 0; i < 100; i++) {
        await this.createPost(authorId,{
          content: `it is dummy_data!${i + 1}번`,
          title: `이것은 더미데이터입니다! ${i + 1}번`,
        })
      }
    }
    async createPost( authorId: number, body: CreatePostDto) {
      const post = this.postRepository.create({
        ...body,
        likeCount: 0,
        commentCount: 0,
        author: {
          id: authorId
        },
        
      });
      return await this.postRepository.save(post);
    }


    async getPostById(id: number) {
      const post = await this.postRepository.findOne({
        where: { id },
        relations:['author']
      })
      
      if(!post) throw new NotFoundException('존재하지 않는 게시물입니다.');

      return post
    }


    async updatePost(id: number, body:UpdatePostDto) {

      await this.postRepository.update(id,{
        ...body
      });

      const user = await this.getPostById(id);

      return user;
    }

    async deletePost(id: number) {
      return await this.postRepository.delete(id);
    }
}
