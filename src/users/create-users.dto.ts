import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateUsersDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    @Matches(/^(?![._])[a-z0-9._]+(?<![._])$/, {
        message: 'Username must be 3–20 characters, lowercase letters, numbers, dot or underscore, and cannot start or end with dot or underscore',
    })
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 64)
    @Matches(/^(?!\s)(?!.*\s$)[\p{L}\p{N}\p{P}\p{S}\s]+$/u, {
        message: 'Password must not start or end with spaces and must contain valid characters',
    })
    password: string;
}