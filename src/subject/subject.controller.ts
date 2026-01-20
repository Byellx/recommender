import { Body, Controller, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}
}
