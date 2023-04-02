import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreationApi } from './api/creation.api';
import { ValidationApi } from './api/validation.api';
import { nanoid } from 'nanoid';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const pathToDb = join(process.cwd(), 'src/frontend/db/');

@Injectable()
export class FrontendService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private readonly creationApi = new CreationApi();
  private readonly validationApi = new ValidationApi();

  private readonly storedInvoices: string[] = [];

  /**
   * Create database directory on application start.
   */
  onApplicationBootstrap() {
    mkdirSync(pathToDb, { recursive: true });
  }

  /**
   * Remove database directory on application end.
   */
  onApplicationShutdown() {
    rmSync(pathToDb, { force: true, recursive: true });
  }

  /**
   * Store an invoice in the database.
   *
   * @param token The token associated with the invoice.
   * @param invoice The invoice itself.
   */
  private storeInvoice(token: string, invoice: string) {
    this.storedInvoices.push(token);

    // Handle writing invoices to file
    writeFileSync(`${pathToDb}/${token}.xml`, invoice);
  }

  /**
   * Retrieve an invoice from the database.
   *
   * @param token The token associated with the invoice.
   * @returns The invoice itself.
   */
  private retrieveInvoice(token: string): string {
    return readFileSync(`${pathToDb}/${token}.xml`).toString();
  }

  async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<{ token: string; violations: string[] }> {
    // Parse Dto
    const invoiceParsed = createInvoiceDto.toString();

    // Call creation api
    const invoiceString = await this.creationApi.request(invoiceParsed, 'json');

    // Call validation api
    const violations = await this.validationApi.request(invoiceString);

    // If no violations, store invoice
    let token = null;
    if (violations.length === 0) {
      // Generate a token id for this invoice
      token = nanoid();
      this.storeInvoice(token, invoiceString);
    }

    return { token, violations };
  }
}
