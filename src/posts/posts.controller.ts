import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { AccessTokenGuard } from 'src/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';

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
  async getPostById(@Param('id', ParseIntPipe) id: number) {
   return await this.postsService.getPostById(id);
  }

  // 로그인 한 사용자만 할 수 있도록.
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    @Body() body: CreatePostDto,
    // createParamDecorator의 data는
    // User 데코레이터 인수에 들어올 수 있는 값이다.
    // User 데코레이터의 인수에 값을 입력한 뒤 해당 매개변수는 그 값이 된다.
    @User('id') userId: number 
    ) {
    return this.postsService.createPost(userId,body);
  }

  @Patch(':id')
  async updatePost(@Param('id',ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

}
