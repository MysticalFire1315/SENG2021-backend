import { InvoiceSpecification } from 'src/models/invoice.json';

export class InvoiceModel {
  // Attributes
  private invoiceData: InvoiceSpecification;

  // Constructor probably not needed... TBC

  /**
   * Parse a file containing raw invoice data.
   *
   * Note: The file must be in JSON format!
   *
   * @param invoiceFile The file containing raw invoice data to parse.
   */
  async parse(invoiceFile: string): Promise<void> {
    const invoiceString = JSON.parse(invoiceFile);
    this.invoiceData = {
      InvoiceTypeCode: invoiceString.InvoiceTypeCode,
      DocumentCurrencyCode: invoiceString.InvoiceCurrency,
      AccountingSupplierParty: {
        Party: {
          EndpointID: invoiceString.Supplier.ElectronicAddress,
          PostalAddress: {
            Country: {
              IdentificationCode: invoiceString.Supplier.Address.CountryCode,
            },
          },
          PartyLegalEntity: {
            RegistrationName: invoiceString.Supplier.PartyLegalEntity.Name,
          },
        },
      },
      AccountingBuyerParty: {
        Party: {
          EndpointID: invoiceString.Buyer.electronicAddress,
          PostalAddress: {
            Country: {
              IdentificationCode: invoiceString.Buyer.Address.CountryCode,
            },
          },
          PartyLegalEntity: {
            RegistrationName: invoiceString.Buyer.PartyLegalEntity.Name,
          },
        },
      },
      TaxTotal: [
        // {
        //   TaxAmount: invoiceString.TaxTotal.TaxAmount,
        // }
      ], // An array of 'TaxTotal' is possible for up to 2 'TaxTotal' elements
      LegalMonetaryTotal: {
        LineExtensionAmount:
          invoiceString.LegalMonetaryTotal.LineExtensionAmount,
        TaxExclusiveAmount: invoiceString.LegalMonetaryTotal.TaxExclusiveAmount,
        TaxInclusiveAmount: invoiceString.LegalMonetaryTotal.TaxInclusiveAmount,
        PayableRoundingAmount:
          invoiceString.LegalMonetaryTotal.PayableRoundingAmount,
        PayableAmount: invoiceString.LegalMonetaryTotal.PayableAmount,
      },
      InvoiceLine: [
        //not sure how to handle arrays?
        // {
        //   ID: invoiceString.InvoiceLine.ID,
        //   InvoicedQuantity: invoiceString.InvoiceLine.InvoicedQuantity,
        //   LineExtensionAmount: invoiceString.InvoiceLine.LineExtensionAmount,
        //   Item: {
        //     Name: invoiceString.InvoiceLine.Name,
        //     ClassifiedTaxCategory: {
        //       ID: invoiceString.InvoiceLine.Item.VAT.ID,
        //       TaxScheme: invoiceString.InvoiceLine.Item.VAT.TaxScheme,
        //     }
        //   },
        //   Price: {
        //     PriceAmount: invoiceString.InvoiceLine.Item,
        //   }
        // }
      ],
    };

    if (Object.keys(invoiceString).includes('CustomizationID')) {
      this.invoiceData.CustomizationID = invoiceString.CustomizationID;
    }
    if (Object.keys(invoiceString).includes('ProfileID')) {
      this.invoiceData.ProfileID = invoiceString.ProfileID;
    }
    if (Object.keys(invoiceString).includes('ID')) {
      this.invoiceData.ID = invoiceString.ID;
    }
    if (Object.keys(invoiceString).includes('IssueDate')) {
      this.invoiceData.IssueDate = invoiceString.IssueDate;
    }
    if (Object.keys(invoiceString).includes('DueDate')) {
      this.invoiceData.DueDate = invoiceString.DueDate;
    }
    if (Object.keys(invoiceString).includes('Note')) {
      this.invoiceData.Note = invoiceString.Note;
    }
    if (Object.keys(invoiceString).includes('TaxPointDate')) {
      this.invoiceData.TaxPointDate = invoiceString.TaxPointDate;
    }
    if (Object.keys(invoiceString).includes('TaxCurrencyCode')) {
      this.invoiceData.TaxCurrencyCode = invoiceString.TaxCurrency;
    }

    // AccountingSupplierParty
    if (Object.keys(invoiceString.Supplier).includes('PartyName')) {
      this.invoiceData.AccountingSupplierParty.Party.PartyName =
        invoiceString.Supplier.PartyName;
    }

    // postal address
    if (Object.keys(invoiceString.Supplier.Address).includes('addressLine1')) {
      this.invoiceData.AccountingSupplierParty.Party.PostalAddress =
        invoiceString.Supplier.Address.addressLine1;
    }
    if (
      Object.keys(invoiceString.AccountingSupplierParty.PostalAddress).includes(
        'addressLine2',
      )
    ) {
      this.invoiceData.AccountingSupplierParty.Party.PostalAddress.AdditionalStreetName =
        invoiceString.Supplier.Address.addressLine2;
    }
    if (Object.keys(invoiceString.Supplier.Address).includes('City')) {
      this.invoiceData.AccountingSupplierParty.Party.PostalAddress.CityName =
        invoiceString.Supplier.Address.City;
    }
    if (Object.keys(invoiceString.Supplier.Address).includes('PostCode')) {
      this.invoiceData.AccountingSupplierParty.Party.PostalAddress.PostalZone =
        invoiceString.Supplier.Address.PostCode;
    }
    if (
      Object.keys(invoiceString.Supplier.Address).includes('countrySubdivision')
    ) {
      this.invoiceData.AccountingSupplierParty.Party.PostalAddress.CountrySubentity =
        invoiceString.Supplier.Address.countrySubdivision;
    }

    // Seller PartyLegalEntity
    const StringPartyLegalEntity = invoiceString.Supplier.PartyLegalEntity;
    if (Object.keys(StringPartyLegalEntity).includes('CompanyID')) {
      this.invoiceData.AccountingSupplierParty.Party.PartyLegalEntity.CompanyID =
        StringPartyLegalEntity.CompanyID;
    }

    // Seller Contact
    if (Object.keys(invoiceString.Supplier).includes('Contact')) {
      const StringContact = invoiceString.Supplier.Contact;
      if (Object.keys(StringContact).includes('Name')) {
        this.invoiceData.AccountingSupplierParty.Party.Contact.Name =
          StringContact.Name;
      }
      if (Object.keys(StringContact).includes('Telephone')) {
        this.invoiceData.AccountingSupplierParty.Party.Contact.Telephone =
          StringContact.Telephone;
      }
      if (Object.keys(StringContact).includes('ElectronicMail')) {
        this.invoiceData.AccountingSupplierParty.Party.Contact.ElectronicMail =
          StringContact.ElectronicMail;
      }
    }

    // AccountingBuyerParty
    if (Object.keys(invoiceString.Buyer).includes('PartyName')) {
      this.invoiceData.AccountingBuyerParty.Party.PartyName =
        invoiceString.Buyer.PartyName;
    }
    // postal address
    if (Object.keys(invoiceString.Buyer.Address).includes('addressLine1')) {
      this.invoiceData.AccountingBuyerParty.Party.PostalAddress =
        invoiceString.Buyer.Address.addressLine1;
    }
    if (
      Object.keys(invoiceString.Buyer.PostalAddress).includes('addressLine2')
    ) {
      this.invoiceData.AccountingBuyerParty.Party.PostalAddress.AdditionalStreetName =
        invoiceString.Buyer.Address.addressLine2;
    }
    if (Object.keys(invoiceString.Buyer.Address).includes('City')) {
      this.invoiceData.AccountingBuyerParty.Party.PostalAddress.CityName =
        invoiceString.Buyer.Address.City;
    }
    if (Object.keys(invoiceString.Buyer.Address).includes('PostCode')) {
      this.invoiceData.AccountingBuyerParty.Party.PostalAddress.PostalZone =
        invoiceString.Buyer.Address.PostCode;
    }
    if (
      Object.keys(invoiceString.Buyer.Address).includes('countrySubdivision')
    ) {
      this.invoiceData.AccountingBuyerParty.Party.PostalAddress.CountrySubentity =
        invoiceString.Buyer.Address.countrySubdivision;
    }

    // Buyer PartyLegalEntity
    if (
      Object.keys(invoiceString.Buyer.PartyLegalEntity).includes('CompanyID')
    ) {
      this.invoiceData.AccountingBuyerParty.Party.PartyLegalEntity.CompanyID =
        invoiceString.Buyer.PartyLegalEntity.CompanyID;
    }

    // Buyer contact
    if (Object.keys(invoiceString.Buyer).includes('Contact')) {
      const StringBuyerContact = invoiceString.Buyer.Contact;
      if (Object.keys(StringBuyerContact).includes('Name')) {
        this.invoiceData.AccountingBuyerParty.Party.Contact.Name =
          StringBuyerContact.Name;
      }
      if (Object.keys(StringBuyerContact).includes('Telephone')) {
        this.invoiceData.AccountingBuyerParty.Party.Contact.Telephone =
          StringBuyerContact.Telephone;
      }
      if (Object.keys(StringBuyerContact).includes('ElectronicMail')) {
        this.invoiceData.AccountingBuyerParty.Party.Contact.ElectronicMail =
          StringBuyerContact.ElectronicMail;
      }
    }

    // Tax Total
    const StringTaxTotal = invoiceString.TaxTotal;
    const TaxLength = StringTaxTotal.length;
    for (let i = 0; i < TaxLength; i++) {
      if (Object.keys(StringTaxTotal[i]).includes('TaxSubtotal')) {
        const StringTaxCategory = StringTaxTotal[i].TaxSubtotal.TaxCategory;
        if (Object.keys(StringTaxCategory).includes('Percent')) {
          this.invoiceData.TaxTotal[i].TaxSubtotal.TaxCategory.Percent =
            StringTaxCategory.Percent;
        }
        if (Object.keys(StringTaxCategory).includes('TaxExemptionReason')) {
          this.invoiceData.TaxTotal[
            i
          ].TaxSubtotal.TaxCategory.TaxExemptionReason =
            StringTaxCategory.TaxExemptionReason;
        }
      }
    }

    // LegalMonetaryTotal
    if (
      Object.keys(invoiceString.LegalMonetaryTotal).includes(
        'AllowanceTotalAmount',
      )
    ) {
      this.invoiceData.LegalMonetaryTotal.AllowanceTotalAmount =
        invoiceString.LegalMonetaryTotal.AllowanceTotalAmount;
    }
    if (
      Object.keys(invoiceString.LegalMonetaryTotal).includes(
        'ChargeTotalAmount',
      )
    ) {
      this.invoiceData.LegalMonetaryTotal.ChargeTotalAmount =
        invoiceString.LegalMonetaryTotal.ChargeTotalAmount;
    }
    if (
      Object.keys(invoiceString.LegalMonetaryTotal).includes('PrepaidAmount')
    ) {
      this.invoiceData.LegalMonetaryTotal.PrepaidAmount =
        invoiceString.LegalMonetaryTotal.PrepaidAmount;
    }

    // Invoice Line
    const StringInvoiceLine = invoiceString.InvoiceLine;
    const InvoiceLength = invoiceString.InvoiceLine.length;
    for (let i = 0; i < InvoiceLength; i++) {
      if (Object.keys(StringInvoiceLine[i]).includes('Note')) {
        this.invoiceData.InvoiceLine[i].Note = StringInvoiceLine[i].Note;
      }
      // Item
      if (Object.keys(StringInvoiceLine[i].Item).includes('Description')) {
        this.invoiceData.InvoiceLine[i].Item.Description =
          StringInvoiceLine[i].Item.Description;
      }
      // ClassifiedTaxCategory
      if (Object.keys(StringInvoiceLine[i].Item.VAT).includes('Percent')) {
        this.invoiceData.InvoiceLine[i].Item.ClassifiedTaxCategory.Percent =
          StringInvoiceLine[i].Item.VAT.Percent;
      }
      // Price
      if (Object.keys(StringInvoiceLine[i].Price).includes('BaseQuantity')) {
        this.invoiceData.InvoiceLine[i].Price.BaseQuantity =
          StringInvoiceLine[i].Price.BaseQuantity;
      }
    }
  }

  /**
   * Creates a UBL document with the relevant attributes.
   *
   * @returns A relative path to the newly created UBL document.
   */
  async createUBL(): Promise<string> {
    // Create the file and return a relative path to the file
    return './invoice1.xml';
  }
  async getInvoiceData() {
    return this.invoiceData;
  }
}
