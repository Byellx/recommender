import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async comment(userId: number, postId: number, content: string, parentId?: number) {
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
            throw new NotFoundException('O post não existe.');
        }

        if(parentId) {
            const parent = await this.prismaService.prisma.comment.findUnique({
                where: { id: parentId }
            });

            if(!parent) throw new NotFoundException("Este comentário não existe.");

            if(!(parent.postId == postId)) throw new BadRequestException("O comentário pai não pertence ao post.");
        }

        const comment = await this.prismaService.prisma.comment.create({
            data: {
                userId: userId,
                postId: postId,
                content: content,
                ...(parentId && { parentId })
            },
            select: {
                user: { select: { username: true }},
                post: { select: { title: true, content: true }},
                content: true,
                date: true
            }
        });

        return comment;
    }

    async findByPost(postId: number) {
        return this.prismaService.prisma.comment.findMany({
            where: {
                postId: postId
            },
            select: {
                post: { select: { title: true, content: true, author: true, publishedAt: true }},
                content: true,
                user: { select: { username: true }},
                date: true
            }
        });
    }

    async update(commentId: number, content: string, userId: number) {
        const comment = await this.prismaService.prisma.comment.findUnique({
            where: { id: commentId}
        });

        if(!comment) throw new NotFoundException("O comentário não existe.");

        const user = await this.prismaService.prisma.user.findUnique({
            where: { id: userId }
        });

        if(!user) throw new NotFoundException("O usuário não existe.");

        if(comment.userId != userId) throw new ForbiddenException("O usuário não pode editar este comentário.");

        const commentUpdated = await this.prismaService.prisma.comment.update({
            where: { id: commentId },
            data: { content: content }
        });

        return commentUpdated;

    }

    async remove(commentId: number, userId: number) {
        const comment = await this.prismaService.prisma.comment.findUnique({
            where: { id: commentId}
        });

        if(!comment) throw new NotFoundException("O comentário não existe.");

        const user = await this.prismaService.prisma.user.findUnique({
            where: { id: userId }
        });

        if(!user) throw new NotFoundException("O usuário não existe.");

        if(comment.userId != userId) throw new ForbiddenException("O usuário não pode deletar o comentário.");

        const commentRemoved = await this.prismaService.prisma.comment.delete({
            where: { id: commentId }
        });

        return commentRemoved;
    }
}
