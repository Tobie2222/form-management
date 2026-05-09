import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { SubmitFormDto } from './dto/submit-form.dto';

@ApiTags('Submissions')
@Controller()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @ApiOperation({ summary: 'Submit a form' })
  @ApiParam({ name: 'id', type: Number, description: 'Form ID' })
  @ApiResponse({ status: 201, description: 'Form submitted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or form not active',
  })
  @ApiResponse({ status: 404, description: 'Form not found' })
  @Post('forms/:id/submit')
  submit(@Param('id', ParseIntPipe) id: number, @Body() dto: SubmitFormDto) {
    return this.submissionsService.submit(id, dto);
  }

  @ApiOperation({ summary: 'Get all submissions' })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  @Get('submissions')
  findAll() {
    return this.submissionsService.findAll();
  }
}
