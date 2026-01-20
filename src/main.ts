import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SubjectService } from './subject/subject.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  const subjectService = app.get(SubjectService);
  await subjectService.seedSubjects();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
