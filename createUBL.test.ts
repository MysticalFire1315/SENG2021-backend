import { InvoiceModel } from "./invoice.model";
import { InvoiceSpecification } from "./invoice.json";
const fs = require('fs');

function deleteFile(fileName: String): void {
  fs.unlink(fileName, (err: Error) => {
    if (err) throw err;
    console.log('File is successfully deleted');
  });
}
afterEach(() => {
  deleteFile('invoice1.xml');
});
// Concern about telephone numbers treated as numbers, but start with 0

describe("test InvoiceModel createUBL", () => {
  test("Mandatory Field Input", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(""); // Need to parse some kinda file from user input

    newInvoice.createUBL(); //Hopefully returns invoice1.xml in same directory
    const actual = fs.readFileSync('./invoice1.xml');
    const expected = fs.readFileSync('./testMandatoryInput/InvoiceLine1M.xml');
    expect(expected).toStrictEqual(actual);
  });
  test("Mandatory Fields >2 Decimal Place Condition", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");

    newInvoice.createUBL();
    const actual = fs.readFileSync('./invoice1.xml');
    const expected = fs.readFileSync('./testMandatoryInput/DecimalPointOverM.xml');
    expect(expected).toStrictEqual(actual);
  });
  test("Optional Field Input", () => {

    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");
    newInvoice.createUBL();
    const actual = fs.readFileSync('./invoice1.xml');
    const expected = fs.readFileSync('./testOptionalInput/InvoiceLine1O.xml');
    expect(expected).toStrictEqual(actual);
  });
  test("Multiple Invoice Line Mandatory Fields", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");

    newInvoice.createUBL();
    const actual = fs.readFileSync('./invoice1.xml');
    const expected = fs.readFileSync('./testMandatoryInput/InvoiceLine2M.xml');
    expect(expected).toStrictEqual(actual);

  });
  test("Multiple Invoice Line Optional Fields", () => {

    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");
    newInvoice.createUBL();
    const actual = fs.readFileSync('./invoice1.xml');
    const expected = fs.readFileSync('./testOptionalInput/InvoiceLine2O.xml');
    expect(expected).toStrictEqual(actual);
  });
});
