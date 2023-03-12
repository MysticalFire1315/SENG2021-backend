import { InvoiceSpecification } from './invoice.schema';
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
//     PayableRoundingAmount?: 500.68,
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

// Planned input
// type invoiceData = {
//   InvoiceId?: string;
//   IssueDate?: string;
//   DueDate?: string;
//   InvoiceTypeCode: number;
//   Note?: string;
//   TaxPointDate?: string;
//   InvoiceCurrency: string;
//   TaxCurrency?: string;
//   Supplier: {
//     ElectronicAddress: string;
//     PartyName?: { Name: string };
//     Address: {
//       addressLine1?: string;
//       addressLine2?: string;
//       City?: string;
//       PostCode?: string;
//       countrySubdivision?: string;
//       CountryCode: string;
//     };
//     PartyLegalEntity: {
//       Name: string;
//       CompanyID?: number;
//     };
//     Contact?: {
//       Name?: string;
//       Telephone?: number;
//       ElectronicMail?: string;
//     };
//   };
//   Buyer: {
//     electronicAddress: number;
//     PartyName?: { Name: string };
//     Address: {
//       addressLine1?: string;
//       addressLine2?: string;
//       city?: string;
//       postCode?: string;
//       countrySubdivision?: string;
//       CountryCode: string;
//     };
//     PartyLegalEntity: {
//       Name: string;
//       CompanyID?: number;
//     };
//     Contact?: {
//       Name?: string;
//       Telephone?: number;
//       ElectronicMail?: string;
//     };
//   };
//   TaxTotal: [
//     {
//       TaxAmount: number;
//       TaxSubtotal?: {
//         TaxableAmount: number;
//         TaxAmount: number;
//         TaxCategory: {
//           ID: string;
//           Percent?: number;
//           TaxExemptionReason?: string;
//           TaxScheme: { ID: string };
//         };
//       };
//     }
//   ];
//   LegalMonetaryTotal: {
//     LineExtensionAmount: number;
//     TaxExclusiveAmount: number;
//     TaxInclusiveAmount: number;
//     AllowanceTotalAmount?: number;
//     ChargeTotalAmount?: number;
//     PrepaidAmount?: number;
//     PayableRoundingAmount?: number;
//     PayableAmount: number;
//   };
//   InvoiceLine: [
//     {
//       ID: number;
//       Note?: string;
//       InvoicedQuantity: number;
//       LineExtensionAmount: number;
//       Item: {
//         Description?: string;
//         Name: string;
//         VAT: {
//           ID: string;
//           Percent?: number;
//           TaxScheme: { ID: string };
//         };
//       };
//       Price: {
//         PriceAmount: number;
//         BaseQuantity?: number;
//       };
//     }
//   ];
// };

export const outputM: InvoiceSpecification = {
  CustomizationID:
    'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  ID: '33',
  IssueDate: '2010-11-09',
  InvoiceTypeCode: 44,
  DocumentCurrencyCode: 'AUD',
  AccountingSupplierParty: {
    Party: {
      EndpointID: 2541512,
      PostalAddress: {
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mr HD Man',
      },
    },
  },
  AccountingCustomerParty: {
    Party: {
      EndpointID: 14125112,
      PostalAddress: {
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mrs DN Haver',
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
export const outputM2Line: InvoiceSpecification = {
  CustomizationID:
    'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  ID: '33',
  IssueDate: '2010-11-09',
  InvoiceTypeCode: 44,
  DocumentCurrencyCode: 'AUD',
  AccountingSupplierParty: {
    Party: {
      EndpointID: 2541512,
      PostalAddress: {
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mr HD Man',
      },
    },
  },
  AccountingCustomerParty: {
    Party: {
      EndpointID: 14125112,
      PostalAddress: {
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mrs DN Haver',
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
    {
      ID: 124125,
      InvoicedQuantity: 1,
      LineExtensionAmount: 500,
      Item: {
        Name: 'Pocket Money',
        ClassifiedTaxCategory: {
          ID: 'Z',
          TaxScheme: { ID: 'VAT' },
        },
      },
      Price: {
        PriceAmount: 500,
      },
    },
  ],
};

export const outputO: InvoiceSpecification = {
  CustomizationID:
    'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  ID: '33',
  IssueDate: '2010-11-09',
  DueDate: '2011-01-01',
  InvoiceTypeCode: 44,
  Note: 'Ni Hao Ma?',
  TaxPointDate: '2012-04-05',
  DocumentCurrencyCode: 'AUD',
  TaxCurrencyCode: 'AUD',
  AccountingSupplierParty: {
    Party: {
      EndpointID: 2541512,
      PartyName: { Name: 'HD Seller' },
      PostalAddress: {
        StreetName: 'Smith St',
        AdditionalStreetName: 'Nothing else',
        CityName: 'Sydney',
        PostalZone: 'The city',
        CountrySubentity: 'Region A',
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mr HD Man',
        CompanyID: 1111,
      },
      Contact: {
        Name: 'Your Mother',
        Telephone: 61411111111,
        ElectronicMail: 'givesyouHD@gmail.com',
      },
    },
  },
  AccountingCustomerParty: {
    Party: {
      EndpointID: 14125112,
      PartyName: { Name: 'HD Buyer' },
      PostalAddress: {
        StreetName: 'SomewhereElse Ave',
        AdditionalStreetName: 'Nothing else',
        CityName: 'Sydney',
        PostalZone: 'The city',
        CountrySubentity: 'Region A',
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mrs DN Haver',
        CompanyID: 14124,
      },
      Contact: {
        Name: 'Your Father',
        Telephone: 61422222222,
        ElectronicMail: 'IwantHD@gmail.com',
      },
    },
  },
  TaxTotal: [
    {
      TaxAmount: 100.05,
      TaxSubtotal: [
        {
          TaxableAmount: 100.05,
          TaxAmount: 100.05,
          TaxCategory: {
            ID: 'S',
            Percent: 100,
            TaxExemptionReason: 'Because i said so',
            TaxScheme: { ID: 'VAT' },
          },
        },
      ],
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
      Note: 'We take those',
      InvoicedQuantity: 5,
      LineExtensionAmount: 1000.05,
      Item: {
        Description: 'An HD mark',
        Name: 'HD Bestower',
        ClassifiedTaxCategory: {
          ID: 'S',
          Percent: 100,
          TaxScheme: { ID: 'VAT' },
        },
      },
      Price: {
        PriceAmount: 1000.05,
        BaseQuantity: 5,
      },
    },
  ],
};
export const outputO2Line: InvoiceSpecification = {
  CustomizationID:
    'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  ID: '33',
  IssueDate: '2010-11-09',
  DueDate: '2011-01-01',
  InvoiceTypeCode: 44,
  Note: 'Ni Hao Ma?',
  TaxPointDate: '2012-04-05',
  DocumentCurrencyCode: 'AUD',
  TaxCurrencyCode: 'AUD',
  AccountingSupplierParty: {
    Party: {
      EndpointID: 2541512,
      PartyName: { Name: 'HD Seller' },
      PostalAddress: {
        StreetName: 'Smith St',
        AdditionalStreetName: 'Nothing else',
        CityName: 'Sydney',
        PostalZone: 'The city',
        CountrySubentity: 'Region A',
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mr HD Man',
        CompanyID: 1111,
      },
      Contact: {
        Name: 'Your Mother',
        Telephone: 61411111111,
        ElectronicMail: 'givesyouHD@gmail.com',
      },
    },
  },
  AccountingCustomerParty: {
    Party: {
      EndpointID: 14125112,
      PartyName: { Name: 'HD Buyer' },
      PostalAddress: {
        StreetName: 'SomewhereElse Ave',
        AdditionalStreetName: 'Nothing else',
        CityName: 'Sydney',
        PostalZone: 'The city',
        CountrySubentity: 'Region A',
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Mrs DN Haver',
        CompanyID: 14124,
      },
      Contact: {
        Name: 'Your Father',
        Telephone: 61422222222,
        ElectronicMail: 'IwantHD@gmail.com',
      },
    },
  },
  TaxTotal: [
    {
      TaxAmount: 100.05,
      TaxSubtotal: [
        {
          TaxableAmount: 100.05,
          TaxAmount: 100.05,
          TaxCategory: {
            ID: 'S',
            Percent: 100,
            TaxExemptionReason: 'Because i said so',
            TaxScheme: { ID: 'VAT' },
          },
        },
      ],
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
      Note: 'We take those',
      InvoicedQuantity: 5,
      LineExtensionAmount: 1000.05,
      Item: {
        Description: 'An HD mark',
        Name: 'HD Bestower',
        ClassifiedTaxCategory: {
          ID: 'S',
          Percent: 100,
          TaxScheme: { ID: 'VAT' },
        },
      },
      Price: {
        PriceAmount: 1000.05,
        BaseQuantity: 5,
      },
    },
    {
      ID: 124125,
      Note: '2nd Invoice Line',
      InvoicedQuantity: 1,
      LineExtensionAmount: 500,
      Item: {
        Description: 'Some pocket money',
        Name: 'Pocket Money',
        ClassifiedTaxCategory: {
          ID: 'S',
          Percent: 100,
          TaxScheme: { ID: 'VAT' },
        },
      },
      Price: {
        PriceAmount: 500,
        BaseQuantity: 1,
      },
    },
  ],
};
