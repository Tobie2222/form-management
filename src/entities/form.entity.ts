import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { FormStatus } from 'src/enums/form.enums';
import { AbstractEntity } from './abstract.entity';

@Entity('forms')
export class Form extends AbstractEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: FormStatus, default: FormStatus.DRAFT })
  status: FormStatus;

  @Column({ default: 0 })
  order: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date;
}
