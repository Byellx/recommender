import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const result = (await super.canActivate(context)) as boolean;
            return result;
        } catch {
            return true;
        }
    }
    
    handleRequest(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any) {
        return user ?? null;
    }
}