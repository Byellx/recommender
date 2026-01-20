import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SubjectModule } from './subject/subject.module';
import { PostModule } from './post/post.module';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), SubjectModule, PostModule, ReactionModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
