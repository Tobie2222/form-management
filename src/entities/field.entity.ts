import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { FieldType } from 'src/enums/fieldtype.enum';
import { AbstractEntity } from './abstract.entity';

@Entity('fields')
export class Field extends AbstractEntity {
  @Column({ name: 'form_id' })
  formId: number;

  @Column({ length: 255 })
  label: string;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  required: boolean;

  @Column({ type: 'json', nullable: true })
  options: object;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date;
}
