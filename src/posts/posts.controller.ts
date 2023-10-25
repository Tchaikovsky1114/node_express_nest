import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

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
  @Get('post')
  getPost(): Post {
    return {
      author: 'newjeans_offcial',
      title: '뉴진스',
      commentCount: 9931,
      content: 'djWJrn',
      likeCount: 312123,
    };
  }
}
