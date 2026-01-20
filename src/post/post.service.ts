import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';
import { Post, PostStatus } from 'generated/prisma/client';

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async create(dto: CreatePostDto, authorId: number) {
        const author = await this.prismaService.prisma.user.findUnique({
            where: {
                id: authorId
            }
        });

        if(!author) {
            throw new NotFoundException('O autor do post não foi encontrado.');
        }

        const subject = await this.prismaService.prisma.subject.findUnique({
            where: {
                id: dto.subjectId
            }
        });

        if(!subject) {
            throw new NotFoundException('O assunto do post não existe.');
        }

        const post = await this.prismaService.prisma.post.create({
            data: {
                title: dto.title,
                content: dto.content,
                authorId: authorId,
                subjectId: dto.subjectId
            }
        });

        return post;
    }

    async publish(postId: number, dto: UpdatePostDto, userId: number) {
        const post = await this.prismaService.prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if(!post) {
            throw new NotFoundException('O post não foi encontrado.');
        }

        const user = await this.prismaService.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) {
            throw new NotFoundException('O usuário não foi encontrado.');
        }

        if(!(post.authorId == userId)) {
            throw new ForbiddenException('O usuário não pode publicar este post.');
        }

        const publishedAt: Date = new Date(Date.now());

        const postPublished = await this.prismaService.prisma.post.update({
            where: {
                id: postId
            },
            data: {
                publishedAt: publishedAt,
                status: dto.status
            }
        });

        return postPublished;
    }

    async feed(userId?: number){
        if(userId){
            const user = await this.prismaService.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if(!user){
                throw new NotFoundException('O usuário não existe.');
            }
        }

        const feed = await this.prismaService.prisma.post.findMany({
            where: {
                status: PostStatus.PUBLISHED
            },
            orderBy: {
                publishedAt: 'desc'
            },
            select: {
                title: true,
                content: true,
                publishedAt: true,
                status: true,
                author: {
                    select: {
                        username: true
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return feed;
    }
}
