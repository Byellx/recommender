import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || ''
        });
    }

    async validate(payload: any) {
        const user = await this.prismaService.prisma.user.findUnique(
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