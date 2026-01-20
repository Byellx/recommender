import { IsNotEmpty } from "class-validator";
import { PostStatus } from "generated/prisma/enums";

export class UpdatePostDto {
    @IsNotEmpty()
    status: PostStatus
}