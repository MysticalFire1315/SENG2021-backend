import { InvoiceModel } from "./invoice.model";
import { InvoiceSpecification } from "./invoice.json";
const fs = require('fs');
const { convert } = require('xmlbuilder2');

describe("test InvoiceModel createUBL", () => {
  test("Mandatory Field Input", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(""); // Need to parse some kinda object string from user input

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync('./testMandatoryInput/InvoiceLine1M.xml');
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
  test("Mandatory Fields >2 Decimal Place Condition", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");

    const actual =  newInvoice.createUBL();
    const expected = fs.readFileSync('./testMandatoryInput/DecimalPointOverM.xml');
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
  test("Optional Field Input", () => {

    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync('./testOptionalInput/InvoiceLine1O.xml');
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
  test("Multiple Invoice Line Mandatory Fields", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync('./testMandatoryInput/InvoiceLine2M.xml');
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);

  });
  test("Multiple Invoice Line Optional Fields", () => {

    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync('./testOptionalInput/InvoiceLine2O.xml');
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
});
