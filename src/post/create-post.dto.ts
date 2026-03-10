import { IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator"

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 200)
    title!: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 1000)
    content!: string

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    subjectId!: number
}