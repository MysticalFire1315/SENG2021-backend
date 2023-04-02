import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreationApi } from './api/creation.api';
import { ValidationApi } from './api/validation.api';

@Injectable()
export class FrontendService {
  private readonly creationApi = new CreationApi();
  private readonly validationApi = new ValidationApi();

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<String> {
    // Parse Dto
    const invoiceParsed = createInvoiceDto.toString();

    // Call creation api
    const invoiceString = await this.creationApi.request(invoiceParsed, 'json');

    // Call validation api
    const invoiceValid = await this.validationApi.request(invoiceString);

    return invoiceString;
  }
}
