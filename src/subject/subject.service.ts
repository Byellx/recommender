import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {
    constructor(private readonly prisma: PrismaService) {}

    async seedSubjects() {
        const SUBJECTS = [
            {
                name: 'Entretenimento',
                slug: 'entertainment'
            },
            {
                name: 'Finanças',
                slug: 'finances'
            },
            {
                name: 'Saúde',
                slug: 'health'
            },
            {
                name: 'Estilo de vida',
                slug: 'lifestyle'
            },
            {
                name: 'Notícias',
                slug: 'news'
            },
            {
                name: 'Política',
                slug: 'politics'
            },
            {
                name: 'Religião',
                slug: 'religion'
            },
            {
                name: 'Ciência',
                slug: 'science'
            },
            {
                name: 'Tecnologia',
                slug: 'technology'
            },
            {
                name: 'Educação',
                slug: 'education'
            }
        ]

        for(const subject of SUBJECTS) {
            await this.prisma.subject.upsert({
                where: { slug: subject.slug },
                update: { name: subject.name},
                create: subject
            });
        }
    }
}