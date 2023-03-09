import { Injectable, StreamableFile } from '@nestjs/common';
import { Invoice } from './model/invoice.model';

@Injectable()
export class CreationService {
  private invoiceList: {
    object: Invoice;
    token: string;
    inUse: boolean;
  }[] = [];

  async invoiceUpload(
    file: Express.Multer.File,
  ): Promise<{ timeEstimate: number; token: string }> {
    const invoice = {
      object: new Invoice(),
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

    const returnFile = new StreamableFile(
      Buffer.from(await invoice.object.createUBL()),
    );

    return returnFile;
  }
}
