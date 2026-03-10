import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateReactionDto } from './create-reaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReactionService } from './reaction.service';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import type CurrentUserType from 'src/utils/types/current-user.type';

@Controller('reaction')
export class ReactionController {
    constructor(private readonly reactionService: ReactionService) {}

    @UseGuards(AuthGuard("jwt"))
    @Post(":postId")
    create(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: CreateReactionDto,
        @CurrentUser() user: CurrentUserType
    ){
        return this.reactionService.create(user.id, postId, dto.type);
    }
}
