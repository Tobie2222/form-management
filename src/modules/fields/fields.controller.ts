import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@ApiTags('Fields')
@Controller('forms/:id/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @ApiOperation({ summary: 'Add field to form' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @Post()
  addField(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateFieldDto) {
    return this.fieldsService.addField(id, dto);
  }

  @ApiOperation({ summary: 'Update a field' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @ApiParam({ name: 'fid', type: Number, description: 'Field ID' })
  @Put(':fid')
  updateField(
    @Param('id', ParseIntPipe) id: number,
    @Param('fid', ParseIntPipe) fid: number,
    @Body() dto: UpdateFieldDto,
  ) {
    return this.fieldsService.updateField(id, fid, dto);
  }

  @ApiOperation({ summary: 'Delete a field' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @ApiParam({ name: 'fid', type: Number, description: 'Field ID' })
  @HttpCode(200)
  @Delete(':fid')
  deleteField(
    @Param('id', ParseIntPipe) id: number,
    @Param('fid', ParseIntPipe) fid: number,
  ) {
    return this.fieldsService.deleteField(id, fid);
  }
}
