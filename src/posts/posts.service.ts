import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserModel } from '../users/entities/user.entity';

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

    async getPostById(id: number) {
      const post = await this.postRepository.findOne({
        where: { id },
        relations:['author']
      })
      
      if(!post) throw new NotFoundException('존재하지 않는 게시물입니다.');

      return post
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

    async updatePost(id: number, body:UpdatePostDto) {
      await this.getPostById(id);

      
      
      return await this.postRepository.update(id,{
        ...body
      })
    }

    async deletePost(id: number) {
      return await this.postRepository.delete(id);
    }
}
