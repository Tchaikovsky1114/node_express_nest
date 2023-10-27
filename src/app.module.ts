import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // db-type
      host: '127.0.0.1',
      port: 5432,
      username: 'develop',
      password: 'audtjd2973!',
      database: 'postgres',
      entities: [PostModel],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
