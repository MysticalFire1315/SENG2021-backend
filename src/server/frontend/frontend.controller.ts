import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FrontendService } from './frontend.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('frontend')
@Controller('frontend')
export class FrontendController {
  constructor(private frontendService: FrontendService) {}

  @Post('invoice/create')
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<{ token: string; violations: string[] }> {
    try {
      const output = await this.frontendService.createInvoice(createInvoiceDto);
      return output;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('invoice/render')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  @Header('Content-Type', 'application/html')
  async renderInvoice(@Query('token') token: string): Promise<string> {
    console.log(token);
    try {
      const output = await this.frontendService.renderHtml(token);
      return output;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
