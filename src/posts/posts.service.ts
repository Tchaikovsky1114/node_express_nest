import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserModel } from '../users/entities/user.entity';
import { PaginatePostDto } from './dtos/paginate-post.dto';

@Injectable()
export class PostsService {
  constructor( 
    // @Injectable처럼 D.I에 주입가능함을 알림
    @InjectRepository(PostModel) private readonly postRepository: Repository<PostModel>,
    @InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>
    ){}

    async getAllPosts() {
      return this.postRepository.find(
        {
          relations: ['author']
        }
      );
    }

    // 오름차순으로 pagination
    async paginatePosts(
      dto: PaginatePostDto
    ) {
      const posts = await this.postRepository.find({
        
        where: {
          id: MoreThan(dto.where__id_more_than ?? 0),
        },
        order: {
          createdAt: dto.order__createdAt,
        },
        take: dto.take
      })

      /**
       * Response
       * 
       * data: Data[]
       * cursor: {
       *    after: 마지막 Data의 Id
       * },
       * count: 응답한 데이터의 갯수
       * next: 다음 요청을 할 때 사용할 url
       */
      return {
        data: posts,
      }
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
