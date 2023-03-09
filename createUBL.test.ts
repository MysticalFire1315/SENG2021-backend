import { InvoiceModel } from "./invoice.model";
import { InvoiceSpecification } from "./invoice.json";

describe("test InvoiceModel createUBL", () => {
  test("Mandatory Field Input", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("./invoiceMandatoryUBL.xml");

    newInvoice.createUBL();
    expect(newInvoice.getInvoiceData()).toStrictEqual({
      InvoiceTypeCode: 44,
      DocumentCurrencyCode: "AUD",
      AccountingSupplierParty: {
        Party: {
          EndpointID: 2541512,
          PostalAddress: {
            Country: {
              IdentificationCode: "AU",
            },
          },
          PartyLegalEntity: {
            RegistrationName: "Mr HD Man",
          },
        },
      },
      AccountingCustomerParty: {
        Party: {
          EndpointID: 14125112,
          PostalAddress: {
            Country: {
              IdentificationCode: "AU",
            },
          },
          PartyLegalEntity: {
            RegistrationName: "Mrs DN Haver",
          },
        },
      },
      TaxTotal: [
        {
          TaxAmount: 100.05,
        },
      ], // An array of 'TaxTotal' is possible for up to 2 'TaxTotal' elements
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
            ClassifiedTaxCategory: {
              ID: "E",
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
    });
  });
  test("Mandatory Fields Missing Input", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("./invoiceMandatoryUBL.xml");

    newInvoice.createUBL();
    expect(newInvoice.getInvoiceData()).toStrictEqual({
      InvoiceTypeCode: 44,
      DocumentCurrencyCode: "AUD",
      AccountingSupplierParty: {
        Party: {
          EndpointID: 2541512,
          PostalAddress: {
            Country: {
              IdentificationCode: null, // ID code is null; not allowed
            },
          },
          PartyLegalEntity: {
            RegistrationName: "Mr HD Man",
          },
        },
      },
      AccountingCustomerParty: {
        Party: {
          EndpointID: 14125112,
          PostalAddress: {
            Country: {
              IdentificationCode: "AU",
            },
          },
          PartyLegalEntity: {
            RegistrationName: "Mrs DN Haver",
          },
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
            ClassifiedTaxCategory: {
              ID: "E",
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
    });
  });
  test("Mandatory Fields >2 Decimal Place Condition", () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("./invoiceMandatoryUBL2dec.xml");

    newInvoice.createUBL();
    expect(newInvoice.getInvoiceData()).toStrictEqual({
      InvoiceTypeCode: 44,
      DocumentCurrencyCode: "AUD",
      AccountingSupplierParty: {
        Party: {
          EndpointID: 2541512,
          PostalAddress: {
            Country: {
              IdentificationCode: null, // ID code is null; not allowed
            },
          },
          PartyLegalEntity: {
            RegistrationName: "Mr HD Man",
          },
        },
      },
      AccountingCustomerParty: {
        Party: {
          EndpointID: 14125112,
          PostalAddress: {
            Country: {
              IdentificationCode: "AU",
            },
          },
          PartyLegalEntity: {
            RegistrationName: "Mrs DN Haver",
          },
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
            ClassifiedTaxCategory: {
              ID: "E",
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
    });
  });
  test("Optional Field Input", () => {});
  test("Multiple Invoice Line Mandatory Fields", () => {});
  test("Multiple Invoice Line Optional Fields", () => {});
});
