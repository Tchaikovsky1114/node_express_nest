import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }
  
  @Get(':id')
  async getPostById(@Param('id') id: string) {
   return await this.postsService.getPostById(+id) 
  }

  @Post()
  async createPost(@Body() body: CreatePostDto) {
    return this.postsService.createPost(body)
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(+id, body)
  }

  @Delete(':id')
  async deletePost(@Param() id: string) {
    return this.postsService.deletePost(+id);
  }
}
