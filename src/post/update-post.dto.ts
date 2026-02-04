import {
    IsString,
    Length,
    IsInt,
    Min,
    IsOptional,
} from "class-validator";

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @Length(3, 200)
    title?: string

    @IsOptional()
    @IsString()
    @Length(3, 1000)
    content?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    subjectId?: number
}