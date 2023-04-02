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
import { RenderingApi } from './api/rendering.api';
import { ApiError } from './api/error.api';

const pathToDb = join(process.cwd(), 'src/frontend/db/');

@Injectable()
export class FrontendService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  private readonly creationApi = new CreationApi();
  private readonly validationApi = new ValidationApi();
  private readonly renderingApi = new RenderingApi();

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
   * Retrieve the path to an invoice from the database.
   *
   * @param token The token associated with the invoice.
   * @returns A path to the invoice itself.
   */
  private retrieveInvoicePath(token: string): string {
    if (!this.storedInvoices.includes(token)) {
      return undefined;
    }
    return `${pathToDb}/${token}.xml`;
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

  async renderHtml(token: string): Promise<string> {
    const invoicePath = this.retrieveInvoicePath(token);

    if (invoicePath === undefined) {
      throw new ApiError({ status: 400, message: 'Token not found' });
    }

    const response = await this.renderingApi.renderHtml(invoicePath);
    return response.data;
  }
}
