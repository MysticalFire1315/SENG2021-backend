import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { InvoiceUploadResponseEntity } from './entities/invoice-upload-response.entity';
import { InvoicesUploadResponseEntity } from './entities/invoices-upload-response.entity';
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
   * @returns A timeEstimate of time taken to process in milliseconds and
   * generated token string
   */
  async invoiceUploadFile(
    file: Express.Multer.File,
    type: string,
  ): Promise<InvoiceUploadResponseEntity> {
    return await this.invoiceUploadString(file.buffer.toString(), type);
  }

  /**
   * Uploads an invoice
   * @param invoiceString The string to parse
   * @returns A timeEstimate of time taken to process in milliseconds and
   * generated token string
   */
  async invoiceUploadString(
    invoiceString: string,
    type: string,
  ): Promise<InvoiceUploadResponseEntity> {
    if (
      InvoiceModel.stripAndLower(type) !== 'json' &&
      InvoiceModel.stripAndLower(type) !== 'xml' &&
      InvoiceModel.stripAndLower(type) !== 'yaml'
    ) {
      throw new HttpException(
        'type must be `json`, `xml` or `yaml`',
        HttpStatus.BAD_REQUEST,
      );
    }

    const invoice = {
      object: new InvoiceModel(),
      token: nanoid(),
      inUse: true,
    };

    invoice.object.parse(invoiceString, type).then(() => {
      invoice.inUse = false;
    });

    this.invoiceList.push(invoice);
    const processingInvoices = this.invoiceList.filter(
      (invoice) => invoice.inUse === true,
    );
    return {
      timeEstimate: INVOICE_PROCESS_TIME * processingInvoices.length,
      token: invoice.token,
    };
  }

  /**
   * Produces a UBL XML formatted E-invoice
   * @param token A unique token corresponding to an E-invoice
   * @returns A streamable file
   */
  async invoiceDownloadFile(token: string): Promise<StreamableFile> {
    return new StreamableFile(
      Buffer.from(await this.invoiceDownloadString(token)),
    );
  }

  /**
   * Produces a UBL XML formatted E-invoice
   * @param token A unique token corresponding to an E-invoice
   * @returns The UBL string of the E-invoice
   */
  async invoiceDownloadString(token: string): Promise<string> {
    const invoice = this.invoiceList.find((invoice) => invoice.token === token);
    if (!invoice) {
      throw new HttpException('Could not find invoice', HttpStatus.NOT_FOUND);
    } else if (invoice.inUse) {
      throw new HttpException(
        'Invoice still being parsed. Try again later',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return await invoice.object.createUBL();
  }

  /**
   * Uploads a batch of invoices
   * @param file A file to be processed
   * @returns A timeEstimate of time taken to process in milliseconds and
   * an array of tokens associated with each invoice.
   */
  async invoiceUploadBatchFile(
    files: Array<Express.Multer.File>,
    type: string,
  ): Promise<InvoicesUploadResponseEntity> {
    return await this.invoiceUploadBatchString(
      files.map((f) => f.buffer.toString()),
      type,
    );
  }

  /**
   * Uploads a batch of invoices
   * @param invoiceStringArray An array of invoices to parse
   * @returns A timeEstimate of time taken to process in milliseconds and
   * an array of tokens associated with each invoice.
   */
  async invoiceUploadBatchString(
    invoiceStringArray: Array<string>,
    type: string,
  ): Promise<InvoicesUploadResponseEntity> {
    if (
      InvoiceModel.stripAndLower(type) !== 'json' &&
      InvoiceModel.stripAndLower(type) !== 'xml' &&
      InvoiceModel.stripAndLower(type) !== 'yaml'
    ) {
      throw new HttpException(
        'type must be `json`, `xml` or `yaml`',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens: string[] = [];
    invoiceStringArray.forEach((invoiceString) => {
      const invoice = {
        object: new InvoiceModel(),
        token: nanoid(),
        inUse: true,
      };

      invoice.object.parse(invoiceString, type).then(() => {
        invoice.inUse = false;
      });

      this.invoiceList.push(invoice);
      tokens.push(invoice.token);
    });

    const processingInvoices = this.invoiceList.filter(
      (invoice) => invoice.inUse === true,
    );
    return {
      timeEstimate: INVOICE_PROCESS_TIME * processingInvoices.length,
      tokens,
    };
  }
}
