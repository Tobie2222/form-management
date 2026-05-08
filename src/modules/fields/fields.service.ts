import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from 'src/entities/field.entity';
import { Repository } from 'typeorm';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async findByFormId(formId: number): Promise<Field[]> {
    return this.fieldRepository.find({
      where: { formId },
      order: { order: 'ASC' },
    });
  }

  async addField(formId: number, dto: CreateFieldDto) {
    const fields = await this.findByFormId(formId);
    const field = this.fieldRepository.create({
      ...dto,
      formId,
      order: dto.order ?? fields.length,
    });
    await this.fieldRepository.save(field);
    return {
      status: 'success',
      messsage: 'Field added successfully',
      data: field,
    };
  }

  async updateField(formId: number, fieldId: number, dto: UpdateFieldDto) {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId, formId },
    });
    if (!field) throw new NotFoundException('Field not found');

    await this.fieldRepository.update(fieldId, dto);
    return {
      status: 'success',
      messsage: 'Field updated successfully',
    };
  }

  async deleteField(formId: number, fieldId: number) {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId, formId },
    });
    if (!field) throw new NotFoundException('Field not found');

    await this.fieldRepository.delete(fieldId);
    return {
      status: 'success',
      messsage: 'Field deleted successfully',
    };
  }
}
