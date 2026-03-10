import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import type CurrentUserType from 'src/utils/types/current-user.type';
import { CreateCommentDto } from './create-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post(":postId")
    comment(
        @Param("postId", ParseIntPipe) postId: number,
        @Body() dto: CreateCommentDto,
        @CurrentUser() user: CurrentUserType
    ) {
        return this.commentService.comment(user.id, postId, dto.content, dto.parentId);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get(":postId")
    findByPost(
        @Param("postId", ParseIntPipe) postId: number
    ){
        return this.commentService.findByPost(postId);
    }
    
    @UseGuards(AuthGuard("jwt"))
    @Patch(":commentId")
    update(
        @Param("commentId", ParseIntPipe) commentId: number,
        @Body() dto: CreateCommentDto,
        @CurrentUser() user: CurrentUserType
    ){
        return this.commentService.update(commentId, dto.content, user.id)
    }
    
    @UseGuards(AuthGuard("jwt"))
    @Delete(":commentId")
    remove(
        @Param("commentId", ParseIntPipe) commentId: number,
        @CurrentUser() user: CurrentUserType
    ){
        return this.commentService.remove(commentId, user.id);
    }
}
