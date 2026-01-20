import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './update-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(
        @Body() dto: CreatePostDto,
        @Req() req
    ) {
        return this.postService.create(dto, req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(":id/publish")
    publish(
        @Param('id') id: string,
        @Body() dto: UpdatePostDto,
        @Req() req: any
    ) {
        return this.postService.publish(
            Number(id),
            dto,
            req.user.id
        );
    }

    @Get("feed")
    findAll(){
        return this.postService.feed();
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("feed/me")
    findAllbyMe(@Req() req: any){
        return this.postService.feed(req.user.id);
    }
}
