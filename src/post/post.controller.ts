import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './update-post.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import type CurrentUserType from 'src/utils/types/current-user.type';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post()
    create(
        @Body() dto: CreatePostDto,
        @CurrentUser() user: CurrentUserType
    ) {
        return this.postService.create(dto, user.id);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get("feed")
    findAll(@CurrentUser() user?: CurrentUserType){
        return this.postService.feed(user?.id);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(":postId")
    read(
        @Param("postId", ParseIntPipe) postId: number,
        @CurrentUser() user?: CurrentUserType
    ) {
        return this.postService.read(postId, user?.id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":postId/update")
    update(
        @Param("postId", ParseIntPipe) postId: number,
        @Body()          dto: UpdatePostDto,
        @CurrentUser()   user: CurrentUserType
    ) {
        return this.postService.update(postId, user.id, dto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":postId/publish")
    publish(
        @Param("postId", ParseIntPipe) postId: number,
        @CurrentUser() user: CurrentUserType
    ) {
        return this.postService.publish(postId, user.id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":postId/archive")
    archive(
        @Param("postId", ParseIntPipe) postId: number,
        @CurrentUser() user: CurrentUserType
    ){
        return this.postService.archive(postId, user.id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":postId")
    delete(
        @Param("postId", ParseIntPipe) postId: number,
        @CurrentUser() user: CurrentUserType
    ){
        return this.postService.delete(postId, user.id);
    }
}
