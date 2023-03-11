import { InvoiceModel } from "./invoice";
import { outputM, outputM2Line, outputO, outputO2Line } from './invoice.parse.output';

describe("test InvoiceModel parse", () => {
  test("Mandatory Field Input", () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.invoiceData).toStrictEqual(outputM);
  });
  test("Mandatory Fields Missing Input", () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.invoiceData).toThrow(Error);
  });
  test("Mandatory Fields >2 Decimal Place Condition", () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.invoiceData).toStrictEqual(outputM);
  });
  test("Optional Field Input", () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.invoiceData).toStrictEqual(outputO);
  });
  test("Multiple Invoice Line Mandatory Fields", () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.invoiceData).toStrictEqual(outputM2Line);
  });
  test("Multiple Invoice Line Optional Fields", () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.invoiceData).toStrictEqual(outputO2Line);
  });
});
