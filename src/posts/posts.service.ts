import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor( 
    @InjectRepository(PostModel) // @Injectable처럼 D.I에 주입가능함을 알림
    private readonly postRepository: Repository<PostModel> // Inject Repository
    ){}

    async getAllPosts() {
      return this.postRepository.find();
    }

    async getPostById(id: number) {
      const post = await this.postRepository.findOne({
        where: {
          id
        }
      })
      if(!post) throw new NotFoundException('존재하지 않는 계정입니다.');

      return post
    }

    async createPost(body: CreatePostDto) {
      const post = this.postRepository.create(body);
      return await this.postRepository.save(post);
    }

    async updatePost(id: number, body:UpdatePostDto) {
      await this.getPostById(id);

      const {likeCount, commentCount, title, content} = body;
      
      return await this.postRepository.update(id,{
        content,
        likeCount,
        title,
        commentCount,
      })
    }

    async deletePost(id: number) {
      return await this.postRepository.delete(id);
    }
}
