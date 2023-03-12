import { readFileSync } from 'fs';
import { join } from 'path';
import { InvoiceModel } from './invoice';
import {
  outputM,
  outputM2Line,
  outputO,
  outputO2Line,
} from './invoice.parse.output';

const path = join(process.cwd(), 'src/creation/model/testParseInputData');

describe('test InvoiceModel parse', () => {
  test('Mandatory Field Input', () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse(readFileSync(path + 'inputM.json').toString());
    expect(newInvoice.invoiceData).toStrictEqual(outputM);
  });
  test('Mandatory Fields Missing Input', () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse(readFileSync(path + 'inputError.json').toString());
    expect(newInvoice.invoiceData).toThrow(Error);
  });
  test('Mandatory Fields >2 Decimal Place Condition', () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse(readFileSync(path + 'input2D.json').toString());
    expect(newInvoice.invoiceData).toStrictEqual(outputM);
  });
  test('Optional Field Input', () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse(readFileSync(path + 'inputO.json').toString());
    expect(newInvoice.invoiceData).toStrictEqual(outputO);
  });
  test('Multiple Invoice Line Mandatory Fields', () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse(readFileSync(path + 'inputM2Line.json').toString());
    expect(newInvoice.invoiceData).toStrictEqual(outputM2Line);
  });
  test('Multiple Invoice Line Optional Fields', () => {
    const newInvoice = new InvoiceModel();
    newInvoice.parse(readFileSync(path + 'inputO2Line.json').toString());
    expect(newInvoice.invoiceData).toStrictEqual(outputO2Line);
  });
});
