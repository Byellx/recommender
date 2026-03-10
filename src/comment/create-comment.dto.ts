import { IsNotEmpty, IsOptional, Length } from "class-validator"

export class CreateCommentDto {
    @IsNotEmpty()
    @Length(1, 1000)
    content!: string

    @IsOptional()
    parentId?: number
}