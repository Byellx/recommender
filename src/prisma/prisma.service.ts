import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
extends PrismaClient
implements OnModuleInit, OnModuleDestroy {
    public prisma: PrismaClient
    
    constructor(){
        const connectionString = process.env.DATABASE_URL!;
        const adapter = new PrismaPg({connectionString});
        
        super({adapter});
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}