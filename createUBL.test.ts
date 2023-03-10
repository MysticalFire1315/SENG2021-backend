import { InvoiceModel } from "./invoice.model";
import { InvoiceSpecification } from "./invoice.json";
const fs = require("fs");
const { convert } = require("xmlbuilder2");

describe("test InvoiceModel createUBL", () => {
  test("Mandatory Field Input", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(`
    {
      InvoiceTypeCode: 44,
      InvoiceCurrency: "AUD",
      Supplier: {
        ElectronicAddress: 2541512,
        Address: {
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mr HD Man",
        },
      },
      Buyer: {
        electronicAddress: 14125112,
        Address: {
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mrs DN Haver",
        },
      },
      TaxTotal: [
        {
          TaxAmount: 100.05,
        },
      ],
      LegalMonetaryTotal: {
        LineExtensionAmount: 500.68,
        TaxExclusiveAmount: 500.68,
        TaxInclusiveAmount: 500.68,
        PayableAmount: 500.68,
      },
      InvoiceLine: [
        {
          ID: 124124,
          InvoicedQuantity: 5,
          LineExtensionAmount: 1000.05,
          Item: {
            Name: "HD Bestower",
            VAT: {
              ID: "Z",
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 1000.05,
          },
        },
      ],
      }
    `);

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync("./testMandatoryInput/InvoiceLine1M.xml");
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });

  test("Mandatory Fields >2 Decimal Place Condition", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(`
    {
      InvoiceTypeCode: 44,
      InvoiceCurrency: "AUD",
      Supplier: {
        ElectronicAddress: 2541512,
        Address: {
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mr HD Man",
        },
      },
      Buyer: {
        electronicAddress: 14125112,
        Address: {
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mrs DN Haver",
        },
      },
      TaxTotal: [
        {
          TaxAmount: 100.05,
        },
      ],
      LegalMonetaryTotal: {
        LineExtensionAmount: 500.68123,
        TaxExclusiveAmount: 500.68123,
        TaxInclusiveAmount: 500.68123,
        PayableAmount: 500.68123,
      },
      InvoiceLine: [
        {
          ID: 124124,
          InvoicedQuantity: 5,
          LineExtensionAmount: 1000.05,
          Item: {
            Name: "HD Bestower",
            VAT: {
              ID: "Z",
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 1000.05,
          },
        },
      ],
      }
    `);

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync(
      "./testMandatoryInput/DecimalPointOverM.xml"
    );
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
  test("Optional Field Input", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(`
    {
      InvoiceId: "33",
      IssueDate: "2010-11-09",
      DueDate: "2011-01-01",
      InvoiceTypeCode: 44,
      Note: "Ni Hao Ma?",
      TaxPointDate: "2012-04-05",
      InvoiceCurrency: "AUD",
      TaxCurrency: "AUD",
      Supplier: {
        ElectronicAddress: 2541512,
        PartyName: { Name: "HD Seller" },
        Address: {
          addressLine1: "Smith St",
          addressLine2: "Nothing else",
          City: "Sydney",
          PostCode: "The city",
          countrySubdivision: "Region A",
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mr HD Man",
          CompanyID: 1111,
        },
        Contact: {
          Name: "Your Mother",
          Telephone: 61411111111,
          ElectronicMail: "givesyouHD@gmail.com",
        },
      },
      Buyer: {
        electronicAddress: 14125112,
        PartyName: { Name: "HD Buyer" },
        Address: {
          addressLine1: "SomewhereElse Ave",
          addressLine2: "Nothing else",
          city: "Sydney",
          postCode: "The city",
          countrySubdivision: "Region A",
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mrs DN Haver",
          CompanyID: 14124,
        },
        Contact: {
          Name: "Your Father",
          Telephone: 61422222222,
          ElectronicMail: "IwantHD@gmail.com",
        },
      },
      TaxTotal: [
        {
          TaxAmount: 100.05,
          TaxSubtotal: {
            TaxableAmount: 100.05,
            TaxAmount: 100.05,
            TaxCategory: {
              ID: "S",
              Percent: 100,
              TaxExemptionReason: "Because i said so",
              TaxScheme: { ID: "VAT" },
            },
          },
        },
        {
          TaxAmount: 100.05,
        },
      ],
      LegalMonetaryTotal: {
        LineExtensionAmount: 500.68,
        TaxExclusiveAmount: 500.68,
        TaxInclusiveAmount: 500.68,
        AllowanceTotalAmount: 500.68,
        ChargeTotalAmount: 500.68,
        PrepaidAmount: 500.68,
        PayableRoundingAmount: 500.68,
        PayableAmount: 500.68,
      },
      InvoiceLine: [
        {
          ID: 124124,
          Note: "We take those",
          InvoicedQuantity: 5,
          LineExtensionAmount: 1000.05,
          Item: {
            Description: "An HD mark",
            Name: "HD Bestower",
            VAT: {
              ID: "S",
              Percent: 100,
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 1000.05,
            BaseQuantity: 5,
          },
        },
      ],
      }
    `);

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync("./testOptionalInput/InvoiceLine1O.xml");
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
  test("Multiple Invoice Line Mandatory Fields", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(`
    {
      InvoiceTypeCode: 44,
      InvoiceCurrency: "AUD",
      Supplier: {
        ElectronicAddress: 2541512,
        Address: {
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mr HD Man",
        },
      },
      Buyer: {
        electronicAddress: 14125112,
        Address: {
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mrs DN Haver",
        },
      },
      TaxTotal: [
        {
          TaxAmount: 100.05,
        },
      ],
      LegalMonetaryTotal: {
        LineExtensionAmount: 500.68,
        TaxExclusiveAmount: 500.68,
        TaxInclusiveAmount: 500.68,
        PayableAmount: 500.68,
      },
      InvoiceLine: [
        {
          ID: 124124,
          InvoicedQuantity: 5,
          LineExtensionAmount: 1000.05,
          Item: {
            Name: "HD Bestower",
            VAT: {
              ID: "Z",
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 1000.05,
          },
        },
        {
          ID: 124125,
          InvoicedQuantity: 1,
          LineExtensionAmount: 500,
          Item: {
            Name: "Pocket Money",
            VAT: {
              ID: "Z",
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 500,
          },
        },
      ],
      }
    `);

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync("./testMandatoryInput/InvoiceLine2M.xml");
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
  test("Multiple Invoice Line Optional Fields", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse(`
    {
      InvoiceId: "33",
      IssueDate: "2010-11-09",
      DueDate: "2011-01-01",
      InvoiceTypeCode: 44,
      Note: "Ni Hao Ma?",
      TaxPointDate: "2012-04-05",
      InvoiceCurrency: "AUD",
      TaxCurrency: "AUD",
      Supplier: {
        ElectronicAddress: 2541512,
        PartyName: { Name: "HD Seller" },
        Address: {
          addressLine1: "Smith St",
          addressLine2: "Nothing else",
          City: "Sydney",
          PostCode: "The city",
          countrySubdivision: "Region A",
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mr HD Man",
          CompanyID: 1111,
        },
        Contact: {
          Name: "Your Mother",
          Telephone: 61411111111,
          ElectronicMail: "givesyouHD@gmail.com",
        },
      },
      Buyer: {
        electronicAddress: 14125112,
        PartyName: { Name: "HD Buyer" },
        Address: {
          addressLine1: "SomewhereElse Ave",
          addressLine2: "Nothing else",
          city: "Sydney",
          postCode: "The city",
          countrySubdivision: "Region A",
          CountryCode: "AU",
        },
        PartyLegalEntity: {
          Name: "Mrs DN Haver",
          CompanyID: 14124,
        },
        Contact: {
          Name: "Your Father",
          Telephone: 61422222222,
          ElectronicMail: "IwantHD@gmail.com",
        },
      },
      TaxTotal: [
        {
          TaxAmount: 100.05,
          TaxSubtotal: {
            TaxableAmount: 100.05,
            TaxAmount: 100.05,
            TaxCategory: {
              ID: "S",
              Percent: 100,
              TaxExemptionReason: "Because i said so",
              TaxScheme: { ID: "VAT" },
            },
          },
        },
        {
          TaxAmount: 100.05,
        },
      ],
      LegalMonetaryTotal: {
        LineExtensionAmount: 500.68,
        TaxExclusiveAmount: 500.68,
        TaxInclusiveAmount: 500.68,
        AllowanceTotalAmount: 500.68,
        ChargeTotalAmount: 500.68,
        PrepaidAmount: 500.68,
        PayableRoundingAmount: 500.68,
        PayableAmount: 500.68,
      },
      InvoiceLine: [
        {
          ID: 124124,
          Note: "We take those",
          InvoicedQuantity: 5,
          LineExtensionAmount: 1000.05,
          Item: {
            Description: "An HD mark",
            Name: "HD Bestower",
            VAT: {
              ID: "S",
              Percent: 100,
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 1000.05,
            BaseQuantity: 5,
          },
        },
        {
          ID: 124125,
          Note: "2nd Invoice Line",
          InvoicedQuantity: 1,
          LineExtensionAmount: 500,
          Item: {
            Description: "Some pocket money",
            Name: "Pocket Money",
            VAT: {
              ID: "S",
              Percent: 100,
              TaxScheme: { ID: "VAT" },
            },
          },
          Price: {
            PriceAmount: 500,
            BaseQuantity: 1,
          },
        },
      ],
      }
    `);

    const actual = newInvoice.createUBL();
    const expected = fs.readFileSync("./testOptionalInput/InvoiceLine2O.xml");
    const actualObj = convert(actual, { format: "object" });
    const expectedObj = convert(expected, { format: "object" });
    expect(expectedObj).toStrictEqual(actualObj);
  });
});
