import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldValueValidator } from 'src/common/validators/fiels.validator';
import { Submission } from 'src/entities/submission.entity';
import { Repository } from 'typeorm';
import { FormsService } from '../forms/forms.service';
import { SubmitFormDto } from './dto/submit-form.dto';
import { FormStatus } from 'src/enums/form.enums';

@Injectable()
export class SubmissionsService {
  private readonly validator = new FieldValueValidator();

  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    private readonly formsService: FormsService,
  ) {}

  async submit(formId: number, dto: SubmitFormDto) {
    const form = await this.formsService.findOne(formId);

    if (form.status !== FormStatus.ACTIVE) {
      throw new BadRequestException('Form nay khong o trang thai active');
    }

    const errors = this.validator.validate(form.fields, dto.data);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Du lieu khong hop le',
        errors,
      });
    }

    const submission = this.submissionRepository.create({
      formId,
      data: dto.data,
    });
    await this.submissionRepository.save(submission);

    return {
      status: 'success',
      message: 'Form submitted successfully',
      data: submission,
    };
  }

  async findAll() {
    const data = await this.submissionRepository.find({
      order: { submittedAt: 'DESC' },
    });
    return {
      status: 'success',
      message: 'Submissions retrieved successfully',
      data,
    };
  }
}
