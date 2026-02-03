import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';
import { PostStatus } from 'generated/prisma/client';

@Injectable()
export class PostService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    private async userExists(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });

        if(!user) throw new NotFoundException(`Usuário não encontrado.`);

        return user;
    }

    private async postExists(postId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { id: true, authorId: true, status: true }
        });

        if(!post) throw new NotFoundException(`Post não encontrado.`);

        return post;
    }

    private async subjectExists(subjectId: number) {
        const subject = await this.prisma.subject.findUnique({
            where: { id: subjectId },
            select: { id: true }
        });

        if(!subject) throw new NotFoundException(`Assunto não encontrado.`);

        return subject;
    }

    private assertOwner(authorId: number, userId: number) {
        if(authorId !== userId) throw new ForbiddenException('O usuário não é o autor do post.');
    }

    private readonly baseSelect = {
        title: true,
        content: true,
        author: { select: { username: true } },
        subject: { select: { name: true } },
        _count: { select: { reactions: true, comments: true } }
    } as const;

    private readonly ownerSelect = {
        ...this.baseSelect,
        status: true,
        createdAt: true,
        publishedAt: true,
        archivedAt: true,
    } as const;

    private readonly publicSelect = {
        ...this.baseSelect,
        publishedAt: true,
    } as const;

    async create(dto: CreatePostDto, authorId: number) {
        await this.userExists(authorId);
        await this.subjectExists(dto.subjectId);

        return this.prisma.post.create({
            data: {
                title: dto.title,
                content: dto.content,
                authorId: authorId,
                subjectId: dto.subjectId
            },
            select: this.ownerSelect
        });
    }

    async read(postId: number, userId?: number) {
        const post = await this.postExists(postId);

        const isOwner = userId != null && userId === post.authorId;

        if(!isOwner) {
            if(post.status !== PostStatus.PUBLISHED) throw new NotFoundException("Post não encontrado.");

            return this.prisma.post.findUnique({
                where: { id: postId },
                select: this.publicSelect
            });
        } else {
            return this.prisma.post.findUnique({
                where: { id: postId },
                select: this.ownerSelect
            });
        }
    }

    async update(postId: number, userId: number, dto: UpdatePostDto) {
        const post = await this.postExists(postId);

        await this.userExists(userId);

        this.assertOwner(post.authorId, userId);

        if(dto.subjectId != null) await this.subjectExists(dto.subjectId);

        return this.prisma.post.update({
            where: { id: postId },
            data: {
                title: dto.title,
                content: dto.content,
                subjectId: dto.subjectId
            },
            select: this.ownerSelect
        });
    }

    async publish(postId: number, userId: number) {
        const post = await this.postExists(postId);

        await this.userExists(userId);

        this.assertOwner(post.authorId, userId);

        if(post.status === PostStatus.PUBLISHED) throw new ForbiddenException(`Essa postagem já está publicada.`);

        return this.prisma.post.update({
            where: { id: postId },
            data: {
                status: PostStatus.PUBLISHED,
                publishedAt: new Date(),
                archivedAt: null
            },
            select: this.ownerSelect
        });
    }

    async archive(postId: number, userId: number) {
        const post = await this.postExists(postId);

        await this.userExists(userId);

        this.assertOwner(post.authorId, userId);

        if(post.status === PostStatus.ARCHIVED) throw new ForbiddenException(`Essa postagem já está arquivada.`);

        return this.prisma.post.update({
            where: { id: postId },
            data: {
                status: PostStatus.ARCHIVED,
                archivedAt: new Date()
            },
            select: this.ownerSelect
        });
    }

    async delete(postId: number, userId: number) {
        const post = await this.postExists(postId);

        await this.userExists(userId);

        this.assertOwner(post.authorId, userId);

        return this.prisma.post.delete({
            where: { id: postId }
        });
    }

    async feed(userId?: number){
        if(userId) await this.userExists(userId)

        return this.prisma.post.findMany({
            where: {
                status: PostStatus.PUBLISHED
            },
            orderBy: {
                publishedAt: 'desc'
            },
            select: {
                title: true,
                content: true,
                author: { select: { username: true }},
                subject: { select: { name: true }},
                publishedAt: true,
                reactions: userId ? {
                    where: { userId: userId },
                    select: { id: true }
                } : false,

                _count: {
                    select: {
                        comments: true,
                        reactions: true
                    }
                }
            }
        });
    }
}
