import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Put()
  async invoiceCreate(@Body() invoiceFile: File) {
    const invoice = await this.apiService.invoiceCreate(invoiceFile);
    return invoice;
  }

  /**
   * app.put('', (req, res) => {
   *   const invoice = await this.apiService.invoice
   * })
   */

  @Get()
  async invoiceReceive(@Param('token') token: string) {
    const invoice = await this.apiService.invoiceReceive(token);
    return invoice;
  }
}
