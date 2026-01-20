import { Injectable, OnModuleInit } from '@nestjs/common';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
    public prisma: PrismaClient
    
    constructor(){
        const connectionString = process.env.DATABASE_URL!;
        const adapter = new PrismaPg({connectionString});
        
        this.prisma = new PrismaClient({adapter});
    }

    async onModuleInit() {
        await this.prisma.$connect()
    }
}