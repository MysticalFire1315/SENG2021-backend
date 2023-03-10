import { InvoiceSpecification } from 'src/models/invoice.json';
import { create } from 'xmlbuilder2';
import dateFormat from 'dateformat';

export class InvoiceModel {
  // Attributes
  private _invoiceData: InvoiceSpecification;
  public static invoiceDefaults = {
    CustomizationID:
      'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  };

  public get invoiceData(): InvoiceSpecification {
    return this._invoiceData;
  }

  /**
   * Replace all object keys with a new key, determined by a provided `getNewKey`
   * callback.
   *
   * @private
   * @static
   * @param {object} obj The object whose keys to replace.
   * @param {(value: object, key: string) => string} getNewKey A function that
   * receives a value-key pair and returns a string of the new key name.
   * @memberof InvoiceModel
   */
  private static replaceAllObjKeys = (
    obj: object,
    getNewKey: (value: object, key: string) => string,
  ): object => {
    if (Array.isArray(obj)) {
      for (const element of obj) {
        InvoiceModel.replaceAllObjKeys(element, getNewKey);
      }
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        const newKey = getNewKey(obj[key], key);
        obj[newKey] = obj[key];
        if (key !== newKey) {
          delete obj[key];
        }
        InvoiceModel.replaceAllObjKeys(obj[newKey], getNewKey);
      }
    }

    return obj;
  };

  /**
   * Determines the xml field name for a given invoice key. If the associated
   * value is an object, `cac:` is inserted before the field name. Otherwise,
   * `cbc:` is inserted instead.
   *
   * @private
   * @static
   * @param {object} value The value associated with the key.
   * @param {string} key The given key.
   * @memberof InvoiceModel
   */
  private static keyMethod = (value: object, key: string): string => {
    return (value instanceof Object ? 'cac:' : 'cbc:') + key;
  };

  /**
   * Parse a string containing raw input data.
   *
   * @param {string} invoiceString - A JSON string of the invoice.
   */
  public async parse(invoiceString: string): Promise<void> {
    const input = JSON.parse(invoiceString);
    this._invoiceData = {
      InvoiceTypeCode: input.InvoiceTypeCode,
      DocumentCurrencyCode: input.InvoiceCurrency,
      AccountingSupplierParty: {
        EndpointID: input.Supplier.ElectronicAddress,
        PostalAddress: {
          Country: {
            IdentificationCode: input.Supplier.Address.CountryCode,
          },
        },
        PartyLegalEntity: {
          RegistrationName: input.Supplier.PartyLegalEntity.Name,
        },
      },
      AccountingBuyerParty: {
        EndpointID: input.Buyer.electronicAddress,
        PostalAddress: {
          Country: {
            IdentificationCode: input.Buyer.Addrress.CountryCode,
          },
        },
        PartyLegalEntity: {
          RegistrationName: input.Buyer.PartyLegalEntity.Name,
        },
      },
      TaxTotal: [
        // {
        //   TaxAmount: input.TaxTotal.TaxAmount,
        // }
      ], // An array of 'TaxTotal' is possible for up to 2 'TaxTotal' elements
      LegalMonetaryTotal: {
        LineExtensionAmount: input.LegalMonetaryTotal.LineExtensionAmount,
        TaxExclusiveAmount: input.LegalMonetaryTotal.TaxExclusiveAmount,
        TaxInclusiveAmount: input.LegalMonetaryTotal.TaxInclusiveAmount,
        PayableRoundingAmount: input.LegalMonetaryTotal.PayableRoundingAmount,
        PayableAmount: input.LegalMonetaryTotal.PayableAmount,
      },
      InvoiceLine: [
        //not sure how to handle arrays?
        // {
        //   ID: input.InvoiceLine.ID,
        //   InvoicedQuantity: input.InvoiceLine.InvoicedQuantity,
        //   LineExtensionAmount: input.InvoiceLine.LineExtensionAmount,
        //   Item: {
        //     Name: input.InvoiceLine.Name,
        //     ClassifiedTaxCategory: {
        //       ID: input.InvoiceLine.Item.VAT.ID,
        //       TaxScheme: input.InvoiceLine.Item.VAT.TaxScheme,
        //     }
        //   },
        //   Price: {
        //     PriceAmount: input.InvoiceLine.Item,
        //   }
        // }
      ],
    };

    if (Object.keys(input).includes('CustomizationID')) {
      this._invoiceData.CustomizationID = input.CustomizationID;
    }
    if (Object.keys(input).includes('ProfileID')) {
      this._invoiceData.ProfileID = input.ProfileID;
    }
    if (Object.keys(input).includes('ID')) {
      this._invoiceData.ID = input.ID;
    }
    if (Object.keys(input).includes('IssueDate')) {
      this._invoiceData.IssueDate = input.IssueDate;
    }
    if (Object.keys(input).includes('DueDate')) {
      this._invoiceData.DueDate = input.DueDate;
    }
    if (Object.keys(input).includes('Note')) {
      this._invoiceData.Note = input.Note;
    }
    if (Object.keys(input).includes('TaxPointDate')) {
      this._invoiceData.TaxPointDate = input.TaxPointDate;
    }
    if (Object.keys(input).includes('TaxCurrencyCode')) {
      this._invoiceData.TaxCurrencyCode = input.TaxCurrency;
    }

    // AccountingSupplierParty
    if (Object.keys(input.Supplier).includes('PartyName')) {
      this._invoiceData.AccountingSupplierParty.PartyName =
        input.Supplier.PartyName;
    }

    // postal address
    if (Object.keys(input.Supplier.Address).includes('addressLine1')) {
      this._invoiceData.PartyName.AccountingSupplierParty.PostalAddress =
        input.Supplier.Address.addressLine1;
    }
    if (
      Object.keys(input.AccountingSupplierParty.PostalAddress).includes(
        'addressLine2',
      )
    ) {
      this._invoiceData.PartyName.AccountingSupplierParty.PostalAddress.AdditionalStreetName =
        input.Supplier.Address.addressLine2;
    }
    if (Object.keys(input.Supplier.Address).includes('City')) {
      this._invoiceData.PartyName.AccountingSupplierParty.PostalAddress.CityName =
        input.Supplier.Address.City;
    }
    if (Object.keys(input.Supplier.Address).includes('PostCode')) {
      this._invoiceData.PartyName.AccountingSupplierParty.PostalAddress.PostalZone =
        input.Supplier.Address.PostCode;
    }
    if (Object.keys(input.Supplier.Address).includes('countrySubdivision')) {
      this._invoiceData.PartyName.AccountingSupplierParty.PostalAddress.CountrySubentity =
        input.Supplier.Address.countrySubdivision;
    }

    // Seller PartyLegalEntity
    const StringPartyLegalEntity = input.Supplier.PartyLegalEntity;
    if (Object.keys(StringPartyLegalEntity).includes('CompanyID')) {
      this._invoiceData.PartyName.AccountingSupplierParty.PartyLegalEntity.CompanyID =
        StringPartyLegalEntity.CompanyID;
    }

    // Seller Contact
    if (Object.keys(input.Supplier).includes('Contact')) {
      const StringContact = input.Supplier.Contact;
      if (Object.keys(StringContact).includes('Name')) {
        this._invoiceData.PartyName.AccountingSupplierParty.Contact.Name =
          StringContact.Name;
      }
      if (Object.keys(StringContact).includes('Telephone')) {
        this._invoiceData.PartyName.AccountingSupplierParty.Contact.Telephone =
          StringContact.Telephone;
      }
      if (Object.keys(StringContact).includes('ElectronicMail')) {
        this._invoiceData.PartyName.AccountingSupplierParty.Contact.ElectronicMail =
          StringContact.ElectronicMail;
      }
    }

    // AccountingBuyerParty
    if (Object.keys(input.Buyer).includes('PartyName')) {
      this._invoiceData.AccountingBuyerParty.PartyName =
        StringAccountingBuyerParty.PartyName;
    }
    // postal address
    if (Object.keys(input.Buyer.Address).includes('addressLine1')) {
      this._invoiceData.PartyName.AccountingBuyerParty.PostalAddress =
        input.Buyer.Address.addressLine1;
    }
    if (Object.keys(input.Buyer.PostalAddress).includes('addressLine2')) {
      this._invoiceData.PartyName.AccountingBuyerParty.PostalAddress.AdditionalStreetName =
        input.Buyer.Address.addressLine2;
    }
    if (Object.keys(input.Buyer.Address).includes('City')) {
      this._invoiceData.PartyName.AccountingBuyerParty.PostalAddress.CityName =
        input.Buyer.Address.City;
    }
    if (Object.keys(input.Buyer.Address).includes('PostCode')) {
      this._invoiceData.PartyName.AccountingBuyerParty.PostalAddress.PostalZone =
        input.Buyer.Address.PostCode;
    }
    if (Object.keys(input.Buyer.Address).includes('countrySubdivision')) {
      this._invoiceData.PartyName.AccountingBuyerParty.PostalAddress.CountrySubentity =
        input.Buyer.Address.countrySubdivision;
    }

    // Buyer PartyLegalEntity
    if (Object.keys(input.Buyer.PartyLegalEntity).includes('CompanyID')) {
      this._invoiceData.AccountingBuyerParty.PartyLegalEntity.CompanyID =
        input.Buyer.PartyLegalEntity.CompanyID;
    }

    // Buyer contact
    if (Object.keys(input.Buyer).includes('Contact')) {
      const StringBuyerContact = input.Buyer.Contact;
      if (Object.keys(StringBuyerContact).includes('Name')) {
        this._invoiceData.PartyName.AccountingBuyerParty.Contact.Name =
          StringBuyerContact.Name;
      }
      if (Object.keys(StringBuyerContact).includes('Telephone')) {
        this._invoiceData.PartyName.AccountingBuyerParty.Contact.Telephone =
          StringBuyerContact.Telephone;
      }
      if (Object.keys(StringBuyerContact).includes('ElectronicMail')) {
        this._invoiceData.PartyName.AccountingBuyerParty.Contact.ElectronicMail =
          StringBuyerContact.ElectronicMail;
      }
    }

    // Tax Total
    const StringTaxTotal = input.TaxTotal;
    const TaxLength = StringTaxTotal.length;
    for (const i = 0; i < length; i++) {
      if (Object.keys(StringTaxTotal[i]).includes('TaxSubtotal')) {
        const StringTaxCategory = StringTaxTotal[i].TaxSubtotal.TaxCategory;
        if (Object.keys(StringTaxCategory).includes('Percent')) {
          this._invoiceData.TaxTotal[i].TaxSubtotal.TaxCategory.Percent =
            StringTaxCategory.Percent;
        }
        if (Object.keys(StringTaxCategory).includes('TaxExemptionReason')) {
          this._invoiceData.TaxTotal[
            i
          ].TaxSubtotal.TaxCategory.TaxExemptionReason =
            StringTaxCategory.TaxExemptionReason;
        }
      }
    }

    // LegalMonetaryTotal
    if (
      Object.keys(input.LegalMonetaryTotal).includes('AllowanceTotalAmount')
    ) {
      this._invoiceData.LegalMonetaryTotal.AllowanceTotalAmount =
        input.LegalMonetaryTotal.AllowanceTotalAmount;
    }
    if (Object.keys(input.LegalMonetaryTotal).includes('ChargeTotalAmount')) {
      this._invoiceData.LegalMonetaryTotal.ChargeTotalAmount =
        input.LegalMonetaryTotal.ChargeTotalAmount;
    }
    if (Object.keys(input.LegalMonetaryTotal).includes('PrepaidAmount')) {
      this._invoiceData.LegalMonetaryTotal.PrepaidAmount =
        input.LegalMonetaryTotal.PrepaidAmount;
    }

    // Invoice Line
    const StringInvoiceLine = input.InvoiceLine;
    const InvoiceLength = input.InvoiceLine.length;
    for (const i = 0; i < length; i++) {
      if (Object.keys(StringInvoiceLine[i]).includes('Note')) {
        this._invoiceData.InvoiceLine[i].Note = StringInvoiceLine[i].Note;
      }
      // Item
      if (Object.keys(StringInvoiceLine[i].Item).includes('Description')) {
        this._invoiceData.InvoiceLine[i].Item.Description =
          StringInvoiceLine[i].Item.Description;
      }
      // ClassifiedTaxCategory
      if (Object.keys(StringInvoiceLine[i].Item.VAT).includes('Percent')) {
        this._invoiceData.InvoiceLine[i].Item.ClassifiedTaxCategory.Percent =
          StringInvoiceLine[i].Item.VAT.Percent;
      }
      // Price
      if (Object.keys(StringInvoiceLine[i].Price).includes('BaseQuantity')) {
        this._invoiceData.InvoiceLine[i].Price.BaseQuantity =
          StringInvoiceLine[i].Price.BaseQuantity;
      }
    }
  }

  /**
   * Create a UBL document with the relevant attributes.
   *
   * @returns The generated UBL document as a string.
   */
  public async createUBL(): Promise<string> {
    // Make a deep clone of the invoice data and add necessary properties
    const cloned = {
      ...InvoiceModel.invoiceDefaults,
      ID: 1, // generate unique id here
      IssueDate: dateFormat('isoDate'),
      ...JSON.parse(JSON.stringify(this.invoiceData)),
    };
    // Replace keys in clone with the UBL formatted xml field names
    InvoiceModel.replaceAllObjKeys(cloned, InvoiceModel.keyMethod);

    // Create the xml document
    const root = create({ Invoice: cloned });
    const xml = root.end({ prettyPrint: true });

    console.log(xml); // for debugging

    return xml;
  }
}
