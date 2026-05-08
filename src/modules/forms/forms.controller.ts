import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Get all forms' })
  @ApiResponse({
    status: 200,
    description: 'List of all forms retrieved successfully',
  })
  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @ApiOperation({ summary: 'Create a new form' })
  @ApiResponse({ status: 201, description: 'Form created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  create(@Body() dto: CreateFormDto) {
    return this.formsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all active forms' })
  @ApiResponse({
    status: 200,
    description: 'List of active forms retrieved successfully',
  })
  @Get('active')
  findActive() {
    return this.formsService.findActive();
  }

  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @ApiResponse({ status: 200, description: 'Form retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a form by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @ApiResponse({ status: 200, description: 'Form updated successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFormDto) {
    return this.formsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a form by ID (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @ApiResponse({ status: 200, description: 'Form deleted successfully' })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.delete(id);
  }
}
