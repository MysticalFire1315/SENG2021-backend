import { readFileSync } from 'fs';
import { InvoiceSpecification } from './invoice.json';

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
  async parse(invoiceFile: String): Promise<void> {
    // Read file
    // const invoiceString...
    this.invoiceData = JSON.parse(invoiceString);
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
  async getInvoiceData() {
    return this.invoiceData;
  }
}
