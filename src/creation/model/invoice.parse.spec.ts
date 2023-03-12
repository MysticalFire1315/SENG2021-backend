import { readFileSync } from 'fs';
import { join } from 'path';
import { InvoiceModel } from './invoice';
import { testAssetsPath } from './spec.config';
import { InvoiceLine1MOutput } from '../../../test/assets/inputs/compulsory/InvoiceLine1MObject';
import { InvoiceLine2MOutput } from '../../../test/assets/inputs/compulsory/InvoiceLine2MObject';
import { InvoiceLine1OOutput } from '../../../test/assets/inputs/optional/InvoiceLine1OObject';
import { InvoiceLine2OOutput } from '../../../test/assets/inputs/optional/InvoiceLine2OObject';
import { DecimalsInvoiceLine1MOutput } from '../../../test/assets/inputs/others/DecimalsInvoiceLine1MObject';

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
        'json',
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
        'json',
      );

      expect(newInvoice.invoiceData).toStrictEqual(expectedObj);
    },
  );
});

describe('Test other cases', () => {
  test('Decimals should be received as is', async () => {
    const newInvoice = new InvoiceModel();
    await newInvoice.parse(
      readFileSync(
        path + 'inputs/others/DecimalsInvoiceLine1M.json',
      ).toString(),
      'json',
    );

    expect(newInvoice.invoiceData).toStrictEqual(DecimalsInvoiceLine1MOutput);
  });

  test('Missing mandatory fields should not result in error', async () => {
    const newInvoice = new InvoiceModel();
    expect(
      async () =>
        await newInvoice.parse(
          readFileSync(
            path + 'inputs/others/SupplierCountryError.json',
          ).toString(),
          'json',
        ),
    ).not.toThrowError();
  });
});
