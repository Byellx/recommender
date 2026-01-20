import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() body: {email: string, password: string}) {
        return this.authService.login(body.email, body.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: any) {
        return req.user;
    }

}
