import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { InvoiceModel } from './model/invoice.model';

@Injectable()
export class CreationService {
  private invoiceList: {
    object: InvoiceModel;
    token: string;
    inUse: boolean;
  }[] = [];

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

    return { timeEstimate: 1, token: invoice.token };
  }

  async invoiceDownload(token: string): Promise<StreamableFile> {
    const invoice = this.invoiceList.find((invoice) => invoice.token === token);
    if (!invoice) {
      throw new HttpException('Could not find invoice', HttpStatus.NOT_FOUND);
    }
    const document = await invoice.object.createUBL();
    return new StreamableFile(Buffer.from(document));
  }
}
