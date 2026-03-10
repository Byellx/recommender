import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private prisma: PrismaService
    ) {
        const secret = configService.getOrThrow<string>('JWT_SECRET');
        if(!secret) throw new Error('JWT_SECRET is not set.');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique(
            {
                where: {
                    id: payload.sub
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    createdAt: true
                }
            }
        );

        if(!user) {
            throw new UnauthorizedException('Este usuário não existe.');
        }

        return user;
    }
}