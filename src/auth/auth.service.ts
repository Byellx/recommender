import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async login(email: string, password: string) {
        const user = await this.prismaService.prisma.user.findUnique(
            {
                where: { email }
            }
        );

        if(!user) {
            throw new UnauthorizedException('Credenciais inválidas.');
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if(!passwordValid) {
            throw new UnauthorizedException('Credenciais inválidas.');
        }

        const payload = {
            sub: user.id,
            username: user.username
        };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
