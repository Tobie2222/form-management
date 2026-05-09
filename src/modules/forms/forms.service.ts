import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/entities/form.entity';
import { Field } from 'src/entities/field.entity';
import { Repository } from 'typeorm';
import { FieldsService } from '../fields/fields.service';
import { FormStatus } from 'src/enums/form.enums';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly fieldsService: FieldsService,
  ) {}

  async findAll(pagination?: PaginationDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [forms, total] = await this.formRepository.findAndCount({
      order: { order: 'ASC' },
      skip,
      take: limit,
    });

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
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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

  async findOne(id: number): Promise<Form & { fields: Field[] }> {
    const form = await this.formRepository.findOne({ where: { id } });

    if (!form) {
      throw new NotFoundException(`Form #${id} không tồn tại`);
    }

    const fields = await this.fieldsService.findByFormId(form.id);
    return { ...form, fields };
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
    await this.findOne(id);
    await this.formRepository.update(id, updateFormDto);
    const updated = await this.findOne(id);
    return {
      status: 'success',
      message: 'Form updated successfully',
      data: updated,
    };
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.formRepository.softDelete(id);
    return {
      status: 'success',
      message: 'Form deleted successfully',
    };
  }
}
