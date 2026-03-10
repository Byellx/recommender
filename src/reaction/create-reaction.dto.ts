import { IsEnum, IsNotEmpty } from "class-validator";
import { ReactionType } from "generated/prisma/enums";

export class CreateReactionDto {
    @IsNotEmpty()
    @IsEnum(ReactionType)
    type!: ReactionType
}