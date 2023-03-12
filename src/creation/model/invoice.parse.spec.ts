import { readFileSync } from 'fs';
import { join } from 'path';
import { InvoiceModel } from './invoice';
import { testAssetsPath } from './spec.config';
import { InvoiceLine1MOutput } from '../../../test/assets/inputs/compulsory/InvoiceLine1MObject';
import { InvoiceLine2MOutput } from '../../../test/assets/inputs/compulsory/InvoiceLine2MObject';
import { InvoiceLine1OOutput } from '../../../test/assets/inputs/optional/InvoiceLine1OObject';
import { InvoiceLine2OOutput } from '../../../test/assets/inputs/optional/InvoiceLine2OObject';

const path = join(process.cwd(), testAssetsPath);

describe('Test compulsory fields', () => {
  test.each([
    { lineNum: 1, expectedObj: InvoiceLine1MOutput },
    { lineNum: 2, expectedObj: InvoiceLine2MOutput },
  ])(
    'Correct compulsory fields with $lineNum invoice line',
    async ({ lineNum, expectedObj }) => {
      const newInvoice = new InvoiceModel();
      await newInvoice.parse(
        readFileSync(
          path + `inputs/compulsory/InvoiceLine${lineNum}M.json`,
        ).toString(),
      );

      expect(newInvoice.invoiceData).toStrictEqual(expectedObj);
    },
  );
});

describe('Test optional fields', () => {
  test.each([
    { lineNum: 1, expectedObj: InvoiceLine1OOutput },
    { lineNum: 2, expectedObj: InvoiceLine2OOutput },
  ])(
    'Correct optional fields with $lineNum invoice line',
    async ({ lineNum, expectedObj }) => {
      const newInvoice = new InvoiceModel();
      await newInvoice.parse(
        readFileSync(
          path + `inputs/optional/InvoiceLine${lineNum}O.json`,
        ).toString(),
      );

      expect(newInvoice.invoiceData).toStrictEqual(expectedObj);
    },
  );
});

// describe('test InvoiceModel parse', () => {
//   test('test', async () => {
//     const newInvoice = new InvoiceModel();
//     await newInvoice.parse(
//       readFileSync(path + 'inputs/compulsory/InvoiceLine1M.json').toString(),
//     );
//     expect(newInvoice.invoiceData).toStrictEqual(output);
//   });
//   // test('Mandatory Field Input', () => {
//   //   const newInvoice = new InvoiceModel();
//   //   newInvoice.parse(readFileSync(path + 'inputM.json').toString());
//   //   expect(newInvoice.invoiceData).toStrictEqual(outputM);
//   // });
//   // test('Mandatory Fields Missing Input', () => {
//   //   const newInvoice = new InvoiceModel();
//   //   newInvoice.parse(readFileSync(path + 'inputError.json').toString());
//   //   expect(newInvoice.invoiceData).toThrow(Error);
//   // });
//   // test('Mandatory Fields >2 Decimal Place Condition', () => {
//   //   const newInvoice = new InvoiceModel();
//   //   newInvoice.parse(readFileSync(path + 'input2D.json').toString());
//   //   expect(newInvoice.invoiceData).toStrictEqual(outputM);
//   // });
//   // test('Optional Field Input', () => {
//   //   const newInvoice = new InvoiceModel();
//   //   newInvoice.parse(readFileSync(path + 'inputO.json').toString());
//   //   expect(newInvoice.invoiceData).toStrictEqual(outputO);
//   // });
//   // test('Multiple Invoice Line Mandatory Fields', () => {
//   //   const newInvoice = new InvoiceModel();
//   //   newInvoice.parse(readFileSync(path + 'inputM2Line.json').toString());
//   //   expect(newInvoice.invoiceData).toStrictEqual(outputM2Line);
//   // });
//   // test('Multiple Invoice Line Optional Fields', () => {
//   //   const newInvoice = new InvoiceModel();
//   //   newInvoice.parse(readFileSync(path + 'inputO2Line.json').toString());
//   //   expect(newInvoice.invoiceData).toStrictEqual(outputO2Line);
//   // });
// });
