import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldType } from 'src/enums/fieldtype.enum';

export class CreateFieldDto {
  @ApiProperty({ example: 'Full Name' })
  @IsString()
  label: string;

  @ApiProperty({ enum: FieldType, example: FieldType.TEXT })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({
    example: ['Male', 'Female', 'Other'],
    description: 'Required when type is select',
  })
  @ValidateIf((o: CreateFieldDto) => o.type === FieldType.SELECT)
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}
