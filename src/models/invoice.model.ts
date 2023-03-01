import { readFileSync } from 'fs';

export class InvoiceModel {
  // Attributes
  private invoiceData: InvoiceSpecification;

  // Constructor probably not needed... TBC

  /**
   * Parse a file containing raw invoice data.
   *
   * Note: The file must be in JSON format!
   *
   * @param invoiceFile The file containing raw invoice data to parse.
   */
  async parse(invoiceFile: File): Promise<void> {
    // Read file
    this.invoiceData = JSON.parse(invoice);
  }

  /**
   * Creates a UBL document with the relevant attributes.
   *
   * @returns A relative path to the newly created UBL document.
   */
  async createUBL(): Promise<string> {
    // Create the file and return a relative path to the file
    return './invoice1.xml';
  }
}

type InvoiceLine = {
  ID: number;                                         // BR-21
  ItemName: number;                                   // BR-25
  ItemNetPrice: number;                               // BR-26 this is for just 1 single invoice line
  InvoiceQuantity: number;                            // BR-22
  MeasurementUnitCode: string;                        // BR-23 simply the units for an item; i.e 5kg of pork, 10Oz of pencils
  CurrentNetAmount: number;                           // BR-12
  // etc
};

// const exampleObj = {
//   SpecificationId: '20asdlfjk2423',
//   InvoiceNumber: 5465231,
//   IssueDate: 'YYYY-MM-DD',
//   // etc
//   SellerPostalAddress: {
//     StreetName: 'Somewhere',
//     CityName: 'Sydney',
//     PostalZone: '2154',
//     Country: { IdentificationCode: '34o8asdflk' },
//   },
// };

// const jsonStr = JSON.stringify(exampleObj, null, 2);

// console.log(jsonStr);

// const jsonObj = JSON.parse(jsonStr);

// console.log(jsonObj);
