export const InvoiceLine1OOutput = {
  CustomizationID:
    'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  ID: '33445566',
  IssueDate: '2017-11-01',
  DueDate: '2017-11-02',
  InvoiceTypeCode: '380',
  Note: 'Please note our new phone number 33 44 55 66',
  TaxPointDate: '2017-11-01',
  DocumentCurrencyCode: 'AUD',
  TaxCurrencyCode: 'AUD',
  AccountingSupplierParty: {
    Party: {
      EndpointID: {
        '@schemeID': '0151',
        '#': '7300010000001',
      },
      PartyName: {
        Name: 'Seller Business Name AS',
      },
      PostalAddress: {
        StreetName: 'Main Street 1',
        AdditionalStreetName: 'Po Box 351',
        CityName: 'London',
        PostalZone: '2154',
        CountrySubentity: 'Region A',
        Country: {
          IdentificationCode: 'GB',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Full Formal Seller Name LTD.',
        CompanyID: { '#': '987654321', '@schemeID': '0151' },
      },
      Contact: {
        Name: 'xyz123',
        Telephone: '887 654 321',
        ElectronicMail: 'test.name@foo.bar',
      },
    },
  },
  AccountingCustomerParty: {
    Party: {
      EndpointID: {
        '@schemeID': '0151',
        '#': '7300010000001',
      },
      PartyName: {
        Name: 'Buyer Business Name AS',
      },
      PostalAddress: {
        StreetName: 'Main Street 1',
        AdditionalStreetName: 'Po Box 351',
        CityName: 'London',
        PostalZone: '2154',
        CountrySubentity: 'Region A',
        Country: {
          IdentificationCode: 'GB',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Full Formal Buyer Name LTD.',
        CompanyID: { '#': '987654321', '@schemeID': '0151' },
      },
      Contact: {
        Name: 'xyz123',
        Telephone: '887 654 321',
        ElectronicMail: 'test.name@foo.bar',
      },
    },
  },
  TaxTotal: [
    {
      TaxAmount: {
        '@currencyID': 'AUD',
        '#': 486.25,
      },
      TaxSubtotal: [
        {
          TaxableAmount: {
            '@currencyID': 'AUD',
            '#': 1945.0,
          },
          TaxAmount: {
            '@currencyID': 'AUD',
            '#': 486.25,
          },
          TaxCategory: {
            ID: 'S',
            Percent: 25.0,
            TaxExemptionReason: 'Exempt',
            TaxScheme: {
              ID: 'VAT',
            },
          },
        },
      ],
    },
  ],
  LegalMonetaryTotal: {
    LineExtensionAmount: {
      '@currencyID': 'AUD',
      '#': 3800.0,
    },
    TaxExclusiveAmount: {
      '@currencyID': 'AUD',
      '#': 3600.0,
    },
    TaxInclusiveAmount: {
      '@currencyID': 'AUD',
      '#': 4500.0,
    },
    AllowanceTotalAmount: {
      '@currencyID': 'AUD',
      '#': 200.0,
    },
    ChargeTotalAmount: {
      '@currencyID': 'AUD',
      '#': 0.0,
    },
    PrepaidAmount: {
      '@currencyID': 'AUD',
      '#': 1000.0,
    },
    PayableRoundingAmount: {
      '@currencyID': 'AUD',
      '#': 0.0,
    },
    PayableAmount: {
      '@currencyID': 'AUD',
      '#': 3500.0,
    },
  },
  InvoiceLine: [
    {
      ID: '12',
      Note: 'New article number 12345',
      InvoicedQuantity: {
        '@unitCode': 'C62',
        '#': 100.0,
      },
      LineExtensionAmount: {
        '@currencyID': 'AUD',
        '#': 2145.0,
      },
      Item: {
        Description: 'Long description of the item on the invoice line',
        Name: 'Item name',
        ClassifiedTaxCategory: {
          ID: 'S',
          Percent: 25.0,
          TaxScheme: {
            ID: 'VAT',
          },
        },
      },
      Price: {
        PriceAmount: {
          '@currencyID': 'AUD',
          '#': 23.45,
        },
        BaseQuantity: {
          '@unitCode': 'C62',
          '#': 1.0,
        },
      },
    },
  ],
};
