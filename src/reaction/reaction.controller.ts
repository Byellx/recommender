import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReactionDto } from './create-reaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReactionType } from 'generated/prisma/enums';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
    constructor(private readonly reactionService: ReactionService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post(":postId")
    create(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: CreateReactionDto,
        @Req() req: any
    ){
        return this.reactionService.create(req.user.id, postId, dto.type);
    }
}
