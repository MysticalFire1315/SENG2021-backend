import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { InvoiceModel } from 'src/models/invoice.model';

@Injectable()
export class ApiService {
  private invoiceList: {
    invoice: InvoiceModel;
    token: string;
    inUse: boolean;
  }[] = [];

  async invoiceCreate(
    invoiceFile: File,
  ): Promise<{ timeEstimate: number; token: string }> {
    const invoice = {
      invoice: new InvoiceModel(),
      token: generateToken(), // Needs implementation
      inUse: true,
    };

    invoice.invoice.parse(invoiceFile).then(() => {
      invoice.inUse = false;
    });

    this.invoiceList.push(invoice);

    // Determine time estimate

    return { timeEstimate: 1, token: invoice.token };
  }

  async invoiceReceive(token: string): Promise<StreamableFile> {
    const invoiceIndex = this.invoiceList.findIndex(
      (invoice) => invoice.token === token,
    );
    const invoice = this.invoiceList.splice(invoiceIndex, 1)[0];

    const filePath = await invoice.invoice.createUBL();
    const returnFile = new StreamableFile(
      createReadStream(join(process.cwd(), filePath)),
    );

    return returnFile;
  }
}
