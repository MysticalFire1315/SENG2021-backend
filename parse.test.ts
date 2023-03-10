import { InvoiceModel } from './invoice.model';
import { InvoiceSpecification } from './invoice.json';

// Expected output
// const invoiceData: InvoiceSpecification = {
//   CustomizationID?: "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0",
//   ProfileID?: "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
//   ID?: "33",
//   IssueDate?: "2010-11-09",
//   DueDate?: "2011-01-01",
//   InvoiceTypeCode: 44,
//   Note?: 'Ni Hao Ma?',
//   TaxPointDate?: "2012-04-05",
//   DocumentCurrencyCode: "AUD",
//   TaxCurrencyCode?: "AUD",
//   AccountingSupplierParty: { Party:
//    {
//     EndpointID: 2541512,
//     PartyName?: { Name: "HD Seller" },
//     PostalAddress: {
//       StreetName?: "Smith St",
//       AdditionalStreetName?: "Nothing else",
//       CityName?: "Sydney",
//       PostalZone?: "The city",
//       CountrySubentity?: "Region A",
//       Country: {
//         IdentificationCode: "AU",
//       }
//     },
//     PartyLegalEntity: {
//       RegistrationName: "Mr HD Man",
//       CompanyID?: 1111,
//     },
//     Contact?: {
//       Name?: "Your Mother",
//       Telephone?: 61411111111,
//       ElectronicMail?: "givesyouHD@gmail.com",
//     }
//    }
//    },
//   AccountingCustomerParty: { Party:
//    {
//     EndpointID: 14125112,
//     PartyName?: { Name: "HD Buyer" },
//     PostalAddress: {
//       StreetName?: "SomewhereElse Ave",
//       AdditionalStreetName?: "Nothing else",
//       CityName?: "Sydney",
//       PostalZone?: "The city",
//       CountrySubentity?: "Region A",
//       Country: {
//         IdentificationCode: "AU",
//       }
//     },
//     PartyLegalEntity: {
//       RegistrationName: "Mrs DN Haver",
//       CompanyID?: 14124,
//     },
//     Contact?: {
//       Name?: "Your Father",
//       Telephone?: 61422222222,
//       ElectronicMail?: "IwantHD@gmail.com",
//     }
//   }
//    },
//   TaxTotal: [
//     {
//       TaxAmount: 100.05,
//       TaxSubtotal?: {
//         TaxableAmount: 100.05,
//         TaxAmount: 100.05,
//         TaxCategory: {
//           ID: "S",
//           Percent?: 100,
//           TaxExemptionReason?: "Because i said so",
//           TaxScheme: { ID: "VAT" },
//         }
//       }
//     },
//     {
//       TaxAmount: 100.05,
//     }
//   ], // An array of 'TaxTotal' is possible for up to 2 'TaxTotal' elements
//   LegalMonetaryTotal: {
//     LineExtensionAmount: 500.68,
//     TaxExclusiveAmount: 500.68,
//     TaxInclusiveAmount: 500.68,
//     AllowanceTotalAmount?: 500.68,
//     ChargeTotalAmount?: 500.68,
//     PrepaidAmount?: 500.68,
//     PayableRoundingAmount: 500.68,
//     PayableAmount: 500.68,
//   },
//   InvoiceLine: [
//     {
//       ID: 124124,
//       Note?: "We take those",
//       InvoicedQuantity: 5,
//       LineExtensionAmount: 1000.05,
//       Item: {
//         Description?: "An HD mark",
//         Name: "HD Bestower",
//         ClassifiedTaxCategory: {
//           ID: "S",
//           Percent?: 100,
//           TaxScheme: { ID: "VAT" },
//         }
//       },
//       Price: {
//         PriceAmount: 1000.05,
//         BaseQuantity?: 5,
//       }
//     }
//   ],
// };

// Planned input (subject to change)
// const invoiceData: InvoiceSpecification = {
//   CustomizationID?: "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0",
//   ProfileID?: "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
//   ID?: "33",
//   IssueDate?: 2010 - 11 - 09,
//   DueDate?: 2011 - 01 - 01,
//   InvoiceTypeCode: 44,
//   Note?: 'Ni Hao Ma?',
//   TaxPointDate?: 2012 - 04 - 05,
//   DocumentCurrencyCode: "AUD",
//   TaxCurrencyCode?: "AUD",
//   AccountingSupplierParty: { Party:
//    {
//     EndpointID: 2541512,
//     PartyName?: { Name: "HD Seller" },
//     PostalAddress: {
//       StreetName?: "Smith St",
//       AdditionalStreetName?: "Nothing else",
//       CityName?: "Sydney",
//       PostalZone?: "The city",
//       CountrySubentity?: "Region A",
//       Country: {
//         IdentificationCode: "AU",
//       }
//     },
//     PartyLegalEntity: {
//       RegistrationName: "Mr HD Man",
//       CompanyID?: 1111,
//     },
//     Contact?: {
//       Name?: "Your Mother",
//       Telephone?: 0411111111,
//       ElectronicMail?: "givesyouHD@gmail.com",
//     }
//     }
//   },
//   AccountingCustomerParty: { Party:
//    {
//     EndpointID: 14125112,
//     PartyName?: { Name: "HD Buyer" },
//     PostalAddress: {
//       StreetName?: "SomewhereElse Ave",
//       AdditionalStreetName?: "Nothing else",
//       CityName?: "Sydney",
//       PostalZone?: "The city",
//       CountrySubentity?: "Region A",
//       Country: {
//         IdentificationCode: "AU",
//       }
//     },
//     PartyLegalEntity: {
//       RegistrationName: "Mrs DN Haver",
//       CompanyID?: 14124,
//     },
//     Contact?: {
//       Name?: "Your Father",
//       Telephone?: 0422222222,
//       ElectronicMail?: "IwantHD@gmail.com",
//     }
//     }
//   },
//   TaxTotal: [
//     {
//       TaxAmount: 100.05,
//       TaxSubtotal?: {
//         TaxableAmount: 100.05,
//         TaxAmount: 100.05,
//         TaxCategory: {
//           ID: "E",
//           Percent?: 100,
//           TaxExemptionReason?: "Because i said so",
//           TaxScheme: { ID: "VAT" },
//         }
//       }
//     },
//     {
//       TaxAmount: 100.05,
//     }
//   ], // An array of 'TaxTotal' is possible for up to 2 'TaxTotal' elements
//   LegalMonetaryTotal: {
//     LineExtensionAmount: 500.68,
//     TaxExclusiveAmount: 500.68,
//     TaxInclusiveAmount: 500.68,
//     AllowanceTotalAmount?: 500.68,
//     ChargeTotalAmount?: 500.68,
//     PrepaidAmount?: 500.68,
//     PayableRoundingAmount: 500.68,
//     PayableAmount: 500.68,
//   },
//   InvoiceLine: [
//     {
//       ID: 124124,
//       Note?: "We take those",
//       InvoicedQuantity: 5,
//       LineExtensionAmount: 1000.05,
//       Item: {
//         Description?: "An HD mark",
//         Name: "HD Bestower",
//         ClassifiedTaxCategory: {
//           ID: "E",
//           Percent?: 100,
//           TaxScheme: { ID: "VAT" },
//         }
//       },
//       Price: {
//         PriceAmount: 1000.05,
//         BaseQuantity?: 5,
//       }
//     }
//   ],
// };
const outputM: InvoiceSpecification = {
  InvoiceTypeCode: 44,
  DocumentCurrencyCode: 'AUD',
  AccountingSupplierParty: { Party: {
    EndpointID: 2541512,
    PostalAddress: {
      Country: {
        IdentificationCode: 'AU',
      },
    },
    PartyLegalEntity: {
      RegistrationName: 'Mr HD Man',
    },
  }
},
  AccountingCustomerParty: { Party: {
    EndpointID: 14125112,
    PostalAddress: {
      Country: {
        IdentificationCode: 'AU',
      },
    },
    PartyLegalEntity: {
      RegistrationName: 'Mrs DN Haver',
    },
  }
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
    PayableAmount: 500.68,
  },
  InvoiceLine: [
    {
      ID: 124124,
      InvoicedQuantity: 5,
      LineExtensionAmount: 1000.05,
      Item: {
        Name: 'HD Bestower',
        ClassifiedTaxCategory: {
          ID: 'Z',
          TaxScheme: { ID: 'VAT' },
        },
      },
      Price: {
        PriceAmount: 1000.05,
      },
    },
  ],
};

describe('test InvoiceModel parse', () => {
  // Test invoice specification info is correct; return error if not
  test('Mandatory Field Input', () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.getInvoiceData()).toStrictEqual(outputM);

  });
  test('Mandatory Fields Missing Input', () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.getInvoiceData()).toThrow(Error);

  });
  test('Mandatory Fields >2 Decimal Place Condition', () => {
    const newInvoice: InvoiceModel = new InvoiceModel();
    newInvoice.parse("");
    expect(newInvoice.getInvoiceData()).toStrictEqual(outputM);
  });
  test('Optional Field Input', () => {});
  test('Multiple Invoice Line Mandatory Fields', () => {});
  test('Multiple Invoice Line Optional Fields', () => {});
});
