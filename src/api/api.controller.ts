import { Controller } from '@nestjs/common';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {};

  @Put()
  async invoiceCreate(@Body invoiceFile: File) {
    const invoice = await this.apiService.invoiceCreate(invoiceFile);
    return invoice;
  }

  @Get()
  async invoiceReceive() {
    const invoice = await this.apiService.invoiceReceive();
    return invoice;
  }
}
