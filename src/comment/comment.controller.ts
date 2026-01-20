import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post(":postId")
    comment(
        @Param("postId", ParseIntPipe) postId: number,
        @Body() comment: string,
        @Req() req: any
    ) {
        return this.commentService.comment(req.user.id, postId, comment);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get(":postId")
    findByPost(
        @Param("postId", ParseIntPipe) postId: number
    ){
        return this.commentService.findByPost(postId);
    }
    
    @UseGuards(AuthGuard("jwt"))
    @Put(":commentId")
    update(
        @Param("commentId", ParseIntPipe) commentId: number,
        @Body() content: string,
        @Req() req: any
    ){
        return this.commentService.update(commentId, content, req.user.id)
    }
    
    @UseGuards(AuthGuard("jwt"))
    @Delete(":commentId")
    remove(
        @Param("commentId", ParseIntPipe) commentId: number,
        @Req() req: any
    ){
        return this.commentService.remove(commentId, req.user.id);
    }
}
