import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FrontendService } from './frontend.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('frontend')
@Controller('frontend')
export class FrontendController {
  constructor(private frontendService: FrontendService) {}

  @Post()
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<{ token: string; violations: string[] }> {
    const output = await this.frontendService.createInvoice(createInvoiceDto);
    return output;
  }
}
