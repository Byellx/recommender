import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './create-users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() dto: CreateUsersDto) {
        return this.usersService.create(dto);
    }
}
