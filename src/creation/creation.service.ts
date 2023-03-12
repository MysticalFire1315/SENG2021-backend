import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { InvoiceModel } from './model/invoice';

const INVOICE_PROCESS_TIME = 1500;

@Injectable()
export class CreationService {
  private invoiceList: {
    object: InvoiceModel;
    token: string;
    inUse: boolean;
  }[] = [];

  /**
   * Uploads an invoice
   * @param file A file to be processed
   * @returns A timeEstimate of time taken to process in milliseconds and generated token string
   */
  async invoiceUpload(
    file: Express.Multer.File,
  ): Promise<{ timeEstimate: number; token: string }> {
    const invoice = {
      object: new InvoiceModel(),
      token: 'abc', // generateToken(), // Needs implementation
      inUse: true,
    };

    invoice.object.parse(file.buffer.toString()).then(() => {
      invoice.inUse = false;
    });

    this.invoiceList.push(invoice);

    // TODO: Determine time estimate
    const processingInvoices = this.invoiceList.filter(
      (invoice) => invoice.inUse === true,
    );
    const timeElapse = INVOICE_PROCESS_TIME * processingInvoices.length;
    return { timeEstimate: timeElapse, token: invoice.token };
  }

  /**
   * Produces a UBL XML formatted E-invoice
   * @param token A unique token corresponding to an E-invoice
   * @returns A streamable file
   */
  async invoiceDownload(token: string): Promise<StreamableFile> {
    const invoice = this.invoiceList.find((invoice) => invoice.token === token);
    if (!invoice) {
      throw new HttpException('Could not find invoice', HttpStatus.NOT_FOUND);
    }
    const document = await invoice.object.createUBL();
    return new StreamableFile(Buffer.from(document));
  }
}
