import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/entities/form.entity';
import { Repository } from 'typeorm';
import { FieldsService } from '../fields/fields.service';
import { FormStatus } from 'src/enums/form.enums';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly fieldsService: FieldsService,
  ) {}

  async findAll() {
    const forms = await this.formRepository.find({ order: { order: 'ASC' } });

    const data = await Promise.all(
      forms.map(async (form) => ({
        ...form,
        fields: await this.fieldsService.findByFormId(form.id),
      })),
    );

    return {
      status: 'success',
      message: 'Forms retrieved successfully',
      data,
    };
  }

  async findActive() {
    const forms = await this.formRepository.find({
      where: { status: FormStatus.ACTIVE },
      order: { order: 'ASC' },
    });

    const data = await Promise.all(
      forms.map(async (form) => ({
        ...form,
        fields: await this.fieldsService.findByFormId(form.id),
      })),
    );

    return {
      status: 'success',
      message: 'Active forms retrieved successfully',
      data,
    };
  }

  async findOne(id: number) {
    const form = await this.formRepository.findOne({ where: { id } });

    if (!form) {
      return {
        status: 'error',
        message: 'Form not found',
      };
    }
    const fields = await this.fieldsService.findByFormId(form.id);

    return {
      status: 'success',
      message: 'Form retrieved successfully',
      data: { ...form, fields },
    };
  }

  async create(createFormDto: CreateFormDto) {
    const form = this.formRepository.create(createFormDto);
    await this.formRepository.save(form);

    return {
      status: 'success',
      message: 'Form created successfully',
      data: form,
    };
  }

  async update(id: number, updateFormDto: UpdateFormDto) {
    const form = await this.formRepository.findOne({ where: { id } });

    if (!form) {
      return {
        status: 'error',
        message: 'Form not found',
      };
    }

    await this.formRepository.update(id, updateFormDto);
    return {
      status: 'success',
      message: 'Form updated successfully',
    };
  }

  async delete(id: number) {
    const form = await this.formRepository.findOne({ where: { id } });

    if (!form) {
      return {
        status: 'error',
        message: 'Form not found',
      };
    }

    await this.formRepository.softDelete(id);
    return {
      status: 'success',
      message: 'Form deleted successfully',
    };
  }
}
