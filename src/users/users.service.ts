import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './create-users.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateUsersDto) {

        const usernameExists = await this.prismaService.prisma.user.findUnique({
            where: {
                username: dto.username
            }
        });

        if(usernameExists) {
            throw new ConflictException('Este nome de usuário já está cadastrado.');
        }

        const emailExists = await this.prismaService.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(emailExists) {
            throw new ConflictException('Este endereço de email já está cadastrado.');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prismaService.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email.toLowerCase(),
                passwordHash
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        return user;
    }
}
