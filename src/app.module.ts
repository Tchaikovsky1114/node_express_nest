import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserModel } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres', // db-type
      host: '127.0.0.1',
      port: 4444,
      username: 'postgres15',
      password: 'postgres15',
      database: 'postgres15',
      entities: [
        PostModel,
        UserModel,
      ],
      synchronize: true
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
