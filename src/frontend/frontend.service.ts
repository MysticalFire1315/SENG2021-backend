import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreationApi } from './api/creation.api';
import { ValidationApi } from './api/validation.api';
import { customAlphabet } from 'nanoid';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { RenderingApi } from './api/rendering.api';
import { ApiError } from './api/error.api';

const pathToDb = join(process.cwd(), 'src/frontend/db/');
const nanoid = customAlphabet('0123456789', 5);

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

  private parseInvoice(createInvoiceDto: CreateInvoiceDto): string {
    const parsed = {
      CustomizationID:
        'urn:cen.eu:en16931:2017#conformant#urn:fdc:peppol.eu:2017:poacc:billing:international:aunz:3.0',
      ID: createInvoiceDto.invoiceid,
      IssueDate: createInvoiceDto.issuedate,
      DueDate: createInvoiceDto.duedate,
      InvoiceTypeCode: 380,
      // TaxPointDate: '2017-11-01',
      InvoiceCurrency: createInvoiceDto.invoicecurrency,
      // TaxCurrency: 'SEK',
      BuyerReference: createInvoiceDto.buyerreference,
      Supplier: {
        ElectronicAddress: createInvoiceDto.sellerelectronicaddress,
        ElectronicAddressScheme: createInvoiceDto.sellerelectronicaddressscheme,
        BusinessName: createInvoiceDto.sellercompany,
        CompanyID: '88599352161',
        Address: {
          AddressLineOne: createInvoiceDto.selleraddress,
          // AddressLineTwo: 'Po Box 351',
          City: createInvoiceDto.sellercity,
          Postcode: createInvoiceDto.sellerpostcode,
          // CountrySubdivision: 'Region A',
          CountryCode: createInvoiceDto.sellercountry,
        },
        PersonName: createInvoiceDto.sellername,
        // CompanyID: '987654321',
        // ContactInfo: {
        //   Name: 'xyz123',
        //   Phone: '887 654 321',
        //   Email: 'test.name@foo.bar',
        // },
      },
      Buyer: {
        ElectronicAddress: createInvoiceDto.buyerelectronicaddress,
        ElectronicAddressScheme: createInvoiceDto.buyerelectronicaddressscheme,
        BusinessName: createInvoiceDto.buyercompany,
        CompanyID: '88599352161',
        Address: {
          AddressLineOne: createInvoiceDto.buyeraddress,
          // AddressLineTwo: 'Po Box 351',
          City: createInvoiceDto.buyercity,
          Postcode: createInvoiceDto.buyerpostcode,
          // CountrySubdivision: 'Region A',
          CountryCode: createInvoiceDto.buyercountry,
        },
        PersonName: createInvoiceDto.buyername,
        // CompanyID: '987654321',
        // ContactInfo: {
        //   Name: 'xyz123',
        //   Phone: '887 654 321',
        //   Email: 'test.name@foo.bar',
        // },
      },
      TaxTotal: [
        {
          TaxAmount: createInvoiceDto.taxamount,
          TaxSubtotal: [
            {
              TaxableAmount: 0,
              TaxAmount: 0,
              TaxCategory: {
                ID: 'E',
                Percent: 0,
                ExemptionReason: 'Exempt',
                TaxScheme: 'GST',
              },
            },
          ],
        },
      ],
      LegalMonetaryTotal: {
        NetAmountInLines: 3800.0,
        NetAmountWithoutTax: 3600.0,
        NetAmountWithTax: 4500.0,
        // AllowanceTotalAmount: 200.0,
        // ChargeTotalAmount: 0.0,
        // PrepaidAmount: 1000.0,
        // PayableRoundingAmount: 0.0,
        PayableAmount: 3500.0,
      },
      InvoiceLine: [],
    };

    // {
    //   ID: '12',
    //   Note: 'New article number 12345',
    //   Quantity: 100,
    //   QuantityUnitCode: 'C62',
    //   LineNetAmount: 2145.0,
    //   Item: {
    //     Name: 'Item name',
    //     Description: 'Long description of the item on the invoice line',
    //     TaxCategory: {
    //       ID: '5',
    //       Percent: 25.0,
    //       TaxScheme: 'VAT',
    //     },
    //   },
    //   Price: {
    //     Amount: 23.45,
    //     Quantity: 1,
    //     QuantityUnitCode: 'C62',
    //   },
    // },

    // Handle invoice lines
    Object.keys(createInvoiceDto)
      .filter((key) => key.match(/^name[0-9]+/m))
      .forEach((key) => {
        const index = key.substring(4);
        parsed.InvoiceLine.push({
          ID: nanoid(),
          Quantity: createInvoiceDto['quantity' + index],
          QuantityUnitCode: createInvoiceDto['unitcode' + index],
          LineNetAmount:
            createInvoiceDto['quantity' + index] *
            createInvoiceDto['cost' + index],
          Item: {
            Name: createInvoiceDto['name' + index],
            Description: createInvoiceDto['description' + index],
            TaxCategory: {
              ID: 'E',
              Percent: 0,
              TaxScheme: 'GST',
            },
          },
          Price: {
            Amount: createInvoiceDto['cost' + index],
          },
        });
      });

    // Handle legal monetary total
    parsed.LegalMonetaryTotal.NetAmountInLines = parsed.InvoiceLine.reduce(
      (acc, cur) => acc + cur.LineNetAmount,
      0,
    );
    parsed.TaxTotal[0].TaxSubtotal[0].TaxableAmount =
      parsed.LegalMonetaryTotal.NetAmountInLines;
    parsed.LegalMonetaryTotal.NetAmountWithTax =
      Number(parsed.LegalMonetaryTotal.NetAmountInLines) +
      Number(parsed.TaxTotal[0].TaxAmount);
    parsed.LegalMonetaryTotal.NetAmountWithoutTax =
      parsed.LegalMonetaryTotal.NetAmountInLines;
    parsed.LegalMonetaryTotal.PayableAmount =
      parsed.LegalMonetaryTotal.NetAmountWithTax;

    // Handle optional fields
    if (createInvoiceDto.notes) {
      parsed['Note'] = createInvoiceDto.notes;
    }

    return JSON.stringify(parsed);
  }

  async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<{ token: string; violations: string[] }> {
    // Parse Dto
    const invoiceParsed = this.parseInvoice(createInvoiceDto);

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
