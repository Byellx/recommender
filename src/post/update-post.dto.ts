import { 
    IsNotEmpty,
    IsString,
    Length,
    IsInt,
    Min,
} from "class-validator";
import { PostStatus } from "generated/prisma/enums";

export class UpdatePostDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 200)
    title: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 1000)
    content: string

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    subjectId: number
    
    @IsNotEmpty()
    status: PostStatus
}