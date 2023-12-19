import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { UserModel } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true // 모든 서비스/프로바이더에 제공하겠다는 뜻
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // db-type
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        PostModel,
        UserModel,
      ],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    CommonModule
  ],
  
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
})
export class AppModule {}
