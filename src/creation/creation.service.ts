import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Invoice } from './model/invoice.model';
import { performance } from 'perf_hooks';

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
    const startTime = performance.now();
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
    const endTime = performance.now();
    const timeElapse = this.invoiceList.length * (endTime - startTime);

    return { timeEstimate: timeElapse, token: invoice.token };
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
