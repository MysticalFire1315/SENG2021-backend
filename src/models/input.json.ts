type invoiceData = {
  InvoiceId?: string;
  IssueDate?: string;
  DueDate?: string;
  InvoiceTypeCode: number;
  Note?: string;
  TaxPointDate?: string;
  InvoiceCurrency: string; // InvoiceCurrency
  TaxCurrency?: string; //TaxCurrency
  Supplier: {
    // Supplier
    ElectronicAddress: string; // ElectronicAddress
    PartyName?: { Name: string };
    Address: {
      // Address
      addressLine1?: string; // addressLine1
      addressLine2?: string; // addressLine2
      City?: string; // City
      PostCode?: string; // PostCode
      countrySubdivision?: string; // countrySubdivision
      CountryCode: string; // CountryCode
    };
    PartyLegalEntity: {
      Name: string; // Name
      CompanyID?: number;
    };
    Contact?: {
      Name?: string;
      Telephone?: number;
      ElectronicMail?: string;
    };
  };
  Buyer: {
    // Buyer
    electronicAddress: number; // electronicAddress
    PartyName?: { Name: string };
    Address: {
      // Address
      addressLine1?: string; // addressLine1
      addressLine2?: string; // addressLine2
      city?: string; // city
      postCode?: string; // postCode
      countrySubdivision?: string; // countrySubdivision
      CountryCode: string; // CountryCode
    };
    PartyLegalEntity: {
      Name: string; // Name
      CompanyID?: number;
    };
    Contact?: {
      Name?: string;
      Telephone?: number;
      ElectronicMail?: string;
    };
  };
  TaxTotal: [
    {
      TaxAmount: number;
      TaxSubtotal?: {
        TaxableAmount: number;
        TaxAmount: number;
        TaxCategory: {
          ID: string;
          Percent?: number;
          TaxExemptionReason?: string;
          TaxScheme: { ID: string };
        };
      };
    },
  ]; // An array of TaxTotal is possible for up to 2 TaxTotal elements
  LegalMonetaryTotal: {
    LineExtensionAmount: number;
    TaxExclusiveAmount: number;
    TaxInclusiveAmount: number;
    AllowanceTotalAmount?: number;
    ChargeTotalAmount?: number;
    PrepaidAmount?: number;
    PayableRoundingAmount: number;
    PayableAmount: number;
  };
  InvoiceLine: [
    {
      ID: string;
      Note?: string;
      InvoicedQuantity: number;
      LineExtensionAmount: number;
      Item: {
        Description?: string;
        Name: string;
        VAT: {
          // VAT
          ID: string;
          Percent?: number;
          TaxScheme: { ID: string };
        };
      };
      Price: {
        PriceAmount: number; // Item net price
        BaseQuantity?: string;
      };
    },
  ];
};
