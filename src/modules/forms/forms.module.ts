import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from 'src/entities/form.entity';
import { FieldsModule } from '../fields/fields.module';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form]), FieldsModule],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
