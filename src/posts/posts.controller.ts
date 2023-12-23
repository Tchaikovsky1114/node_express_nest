import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { AccessTokenGuard } from 'src/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { PaginatePostDto } from './dtos/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query)
  }
  
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
   return await this.postsService.getPostById(id);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async createDummyPost(@User('id', ParseIntPipe) userId: number) {
    await this.postsService.generatePosts(userId)
    return true
  }

  // 로그인 한 사용자만 할 수 있도록.
  @Post()
  @UseGuards(AccessTokenGuard)
  // 
  @UseInterceptors(FileInterceptor('image')) // 1. 파일을 업로드할 필드 이름,
  async createPost(
    @Body() body: CreatePostDto,
    // createParamDecorator의 data는 User 데코레이터 인수에 들어올 수 있는 값이다.
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File
    ) {
    return this.postsService.createPost(userId,body,file?.filename);
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
