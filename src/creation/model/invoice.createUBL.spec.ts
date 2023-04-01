import { readFileSync } from 'fs';
import { join } from 'path';
import { InvoiceModel } from './invoice';
import { convert } from 'xmlbuilder2';
import { testAssetsPath } from '../../spec.config';

const path = join(process.cwd(), testAssetsPath);

describe.each(['json', 'xml', 'yaml'])('Test %s parsing', (parseType) => {
  describe('Test compulsory fields', () => {
    test.each([1, 2])(
      'Correct compulsory fields with %s invoice line',
      async (num) => {
        const newInvoice = new InvoiceModel();
        await newInvoice.parse(
          readFileSync(
            path + `inputs/compulsory/InvoiceLine${num}M.${parseType}`,
          ).toString(),
          parseType,
        );

        const actual = await newInvoice.createUBL();
        const expected = readFileSync(
          path + `outputs/compulsory/InvoiceLine${num}M.xml`,
        ).toString();
        const actualObj = convert(actual, { format: 'object' });
        const expectedObj = convert(expected, { format: 'object' });
        expect(actualObj).toStrictEqual(expectedObj);
      },
    );
  });

  describe('Test optional fields', () => {
    test.each([1, 2])(
      'Correct optional fields with %s invoice line',
      async (num) => {
        const newInvoice = new InvoiceModel();
        await newInvoice.parse(
          readFileSync(
            path + `inputs/optional/InvoiceLine${num}O.${parseType}`,
          ).toString(),
          parseType,
        );

        const actual = await newInvoice.createUBL();
        const expected = readFileSync(
          path + `outputs/optional/InvoiceLine${num}O.xml`,
        ).toString();
        const actualObj = convert(actual, { format: 'object' });
        const expectedObj = convert(expected, { format: 'object' });
        expect(actualObj).toStrictEqual(expectedObj);
      },
    );
  });

  describe('Test other cases', () => {
    test('Decimals should be rounded to 2 places', async () => {
      const newInvoice = new InvoiceModel();
      await newInvoice.parse(
        readFileSync(
          path + `inputs/others/DecimalsInvoiceLine1M.${parseType}`,
        ).toString(),
        parseType,
      );

      const actual = await newInvoice.createUBL();
      const expected = readFileSync(
        path + 'outputs/compulsory/InvoiceLine1M.xml',
      ).toString();
      const actualObj = convert(actual, { format: 'object' });
      const expectedObj = convert(expected, { format: 'object' });
      expect(actualObj).toStrictEqual(expectedObj);
    });

    test('Missing mandatory fields should result in error', async () => {
      const newInvoice = new InvoiceModel();
      await newInvoice.parse(
        readFileSync(
          path + `inputs/others/SupplierCountryError.${parseType}`,
        ).toString(),
        parseType,
      );

      expect(async () => await newInvoice.createUBL()).rejects.toThrowError();
    });
  });
});
