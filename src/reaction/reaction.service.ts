import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionType } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async create(userId: number, postId: number, type: ReactionType) {
        const user = await this.prismaService.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) {
            throw new NotFoundException('O usuário não existe.');
        }

        const post = await this.prismaService.prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if(!post) {
            throw new NotFoundException("O post não existe.");
        }

        const reactionAlreadyExists = await this.prismaService.prisma.reaction.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: userId
                }
            }
        });

        if(reactionAlreadyExists) {
            const reactionRemoved = await this.prismaService.prisma.reaction.delete({
                where: {
                    postId_userId: {
                        postId: postId,
                        userId: userId
                    }
                }
            });

            return {
                operation: "UNLIKE",
                reaction: reactionRemoved
            };
        }

        const reaction = await this.prismaService.prisma.reaction.create({
            data: {
                type: type,
                userId: userId,
                postId: postId
            }
        });

        return {
            operation: "LIKE",
            reaction: reaction
        }
    }
}
