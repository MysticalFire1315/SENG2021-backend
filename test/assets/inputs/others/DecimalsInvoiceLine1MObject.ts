export const DecimalsInvoiceLine1MOutput = {
  ID: 'Invoice01',
  IssueDate: '2019-07-29',
  DueDate: '2019-08-30',
  InvoiceTypeCode: '380',
  DocumentCurrencyCode: 'AUD',
  AccountingSupplierParty: {
    Party: {
      EndpointID: {
        '@schemeID': '0151',
        '#': '47555222000',
      },
      PostalAddress: {
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Supplier Official Name Ltd',
      },
    },
  },
  AccountingCustomerParty: {
    Party: {
      EndpointID: {
        '@schemeID': '0151',
        '#': '91888222000',
      },
      PostalAddress: {
        Country: {
          IdentificationCode: 'AU',
        },
      },
      PartyLegalEntity: {
        RegistrationName: 'Buyer Official Name',
      },
    },
  },
  TaxTotal: [
    {
      TaxAmount: {
        '@currencyID': 'AUD',
        '#': 148.741,
      },
    },
  ],
  LegalMonetaryTotal: {
    LineExtensionAmount: {
      '@currencyID': 'AUD',
      '#': 1487.403,
    },
    TaxExclusiveAmount: {
      '@currencyID': 'AUD',
      '#': 1487.402,
    },
    TaxInclusiveAmount: {
      '@currencyID': 'AUD',
      '#': 1636.1401,
    },
    PayableAmount: {
      '@currencyID': 'AUD',
      '#': 1636.1416,
    },
  },
  InvoiceLine: [
    {
      ID: '124124',
      InvoicedQuantity: {
        '@unitCode': 'E99',
        '#': 10.0,
      },
      LineExtensionAmount: {
        '@currencyID': 'AUD',
        '#': 299.9022,
      },
      Item: {
        Name: 'True-Widgets',
        ClassifiedTaxCategory: {
          ID: 'S',
          TaxScheme: {
            ID: 'GST',
          },
        },
      },
      Price: {
        PriceAmount: {
          '@currencyID': 'AUD',
          '#': 29.986,
        },
      },
    },
  ],
};
