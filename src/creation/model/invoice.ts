import {
  ContactDetails,
  InvoiceLineDetails,
  InvoiceLineItem,
  InvoiceLinePrice,
  InvoiceSpecification,
  ItemTaxCategory,
  LegalMonetaryTotalDetails,
  Party,
  PostalAddressDetails,
  TaxCategoryDetails,
  TaxSubtotalDetails,
  TaxTotalDetails,
} from 'src/creation/model/invoice.schema';
import { create } from 'xmlbuilder2';
import { format } from 'date-fns';

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
  private static replaceAllObjKeys(
    obj: object,
    getNewKey: (value: object, key: string) => string,
  ): object {
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
  }

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
  private static keyMethod(value: object, key: string): string {
    return (value instanceof Object ? 'cac:' : 'cbc:') + key;
  }

  /**
   * Finds the key in the given object matching a given key by stripping all
   * non-alphabets from the object's key and checking if it matches in
   * lowercase.
   *
   * @private
   * @static
   * @param {object} obj The object whose key to find.
   * @param {string} key The key to match against.
   * @memberof InvoiceModel
   */
  private static findKey = (obj: object, key: string): string => {
    return Object.keys(obj).find(
      (objKey) =>
        objKey.replace(/[^a-z]/gi, '').toLowerCase() === key.toLowerCase(),
    );
  };

  /**
   * Parse raw input data as a `Party`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `Party` object corresponding to the UBL invoice specifications.
   * @memberof InvoiceModel
   */
  private static parseParty(input: object): Party {
    // Parse compulsory fields
    const parsed: Party = {
      EndpointID: {
        '@schemeID':
          input[InvoiceModel.findKey(input, 'ElectronicAddressScheme')],
        '#': input[InvoiceModel.findKey(input, 'ElectronicAddress')],
      },
      PostalAddress: InvoiceModel.parsePostalAddress(
        input[InvoiceModel.findKey(input, 'Address')],
      ),
      PartyLegalEntity: {
        RegistrationName: input[InvoiceModel.findKey(input, 'PersonName')],
      },
    };

    // Handle optional fields
    const partyNameKey = InvoiceModel.findKey(input, 'BusinessName');
    if (partyNameKey) {
      parsed.PartyName = {
        Name: input[partyNameKey],
      };
    }
    const companyIdKey = InvoiceModel.findKey(input, 'CompanyID');
    if (companyIdKey) {
      parsed.PartyLegalEntity.CompanyID = input[companyIdKey];
    }
    const contactKey = InvoiceModel.findKey(input, 'ContactInfo');
    if (contactKey) {
      parsed.Contact = InvoiceModel.parseContact(input[contactKey]);
    }

    return parsed;
  }

  /**
   * Parse raw input data as a `PostalAddress`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `PostalAddress` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parsePostalAddress(input: object): PostalAddressDetails {
    // Parse compulsory fields
    const parsed: PostalAddressDetails = {
      Country: {
        IdentificationCode: input[InvoiceModel.findKey(input, 'CountryCode')],
      },
    };

    // Handle optional fields
    const optionalKeys = [
      {
        invoiceField: 'StreetName',
        inputName: InvoiceModel.findKey(input, 'AddressLineOne'),
      },
      {
        invoiceField: 'AdditionalStreetName',
        inputName: InvoiceModel.findKey(input, 'AddressLineTwo'),
      },
      {
        invoiceField: 'CityName',
        inputName: InvoiceModel.findKey(input, 'City'),
      },
      {
        invoiceField: 'PostalZone',
        inputName: InvoiceModel.findKey(input, 'Postcode'),
      },
      {
        invoiceField: 'CountrySubentity',
        inputName: InvoiceModel.findKey(input, 'CountrySubdivision'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        parsed[invoiceField] = input[inputName];
      }
    });

    return parsed;
  }

  /**
   * Parse raw input data as a `Contact`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `Contact` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseContact(input: object): ContactDetails {
    const parsed: ContactDetails = {};

    const optionalKeys = [
      {
        invoiceField: 'Name',
        inputName: InvoiceModel.findKey(input, 'Name'),
      },
      {
        invoiceField: 'Telephone',
        inputName: InvoiceModel.findKey(input, 'Phone'),
      },
      {
        invoiceField: 'ElectronicMail',
        inputName: InvoiceModel.findKey(input, 'EMail'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        parsed[invoiceField] = input[inputName];
      }
    });

    return parsed;
  }

  /**
   * Parse raw input data as a `TaxTotal`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `TaxTotal` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseTaxTotal(input: object[]): TaxTotalDetails[] {
    const parsed: TaxTotalDetails[] = [];
    // Can have 1-2 instances
    for (let i = 0; i < (input.length == 1 ? 1 : 2); i++) {
      const parsedTax: TaxTotalDetails = {
        TaxAmount: {
          '@currencyID':
            input[i][InvoiceModel.findKey(input, 'TaxAmountCurrency')],
          '#': input[i][InvoiceModel.findKey(input[i], 'TaxAmount')],
        },
      };

      const taxSubtotalKey = InvoiceModel.findKey(input[i], 'TaxSubtotal');
      if (taxSubtotalKey) {
        parsedTax.TaxSubtotal = InvoiceModel.parseTaxSubtotal(
          input[i][taxSubtotalKey],
        );
      }

      parsed.push(parsedTax);
    }

    return parsed;
  }

  /**
   * Parse raw input data as a `TaxSubtotal`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `TaxSubtotal` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseTaxSubtotal(input: object[]): TaxSubtotalDetails[] {
    const parsed: TaxSubtotalDetails[] = [];
    input.forEach((item) => {
      const parsedTax: TaxSubtotalDetails = {
        TaxableAmount: item[InvoiceModel.findKey(item, 'TaxableAmount')],
        TaxAmount: item[InvoiceModel.findKey(item, 'TaxAmount')],
        TaxCategory: InvoiceModel.parseTaxCategory(
          item[InvoiceModel.findKey(item, 'TaxCategory')],
        ),
      };

      parsed.push(parsedTax);
    });

    return parsed;
  }

  /**
   * Parse raw input data as a `TaxCategory`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `TaxCategory` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseTaxCategory(input: object): TaxCategoryDetails {
    const parsed: TaxCategoryDetails = {
      ID: input[InvoiceModel.findKey(input, 'ID')],
      TaxScheme: {
        ID: input[InvoiceModel.findKey(input, 'TaxScheme')],
      },
    };

    const optionalKeys = [
      {
        invoiceField: 'Percent',
        inputName: InvoiceModel.findKey(input, 'Percent'),
      },
      {
        invoiceField: 'TaxExemptionReason',
        inputName: InvoiceModel.findKey(input, 'ExemptionReason'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        parsed[invoiceField] = input[inputName];
      }
    });

    return parsed;
  }

  /**
   * Parse raw input data as a `LegalMonetaryTotal`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `LegalMonetaryTotal` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseLegalMonetaryTotal(
    input: object,
  ): LegalMonetaryTotalDetails {
    const parsed: LegalMonetaryTotalDetails = {
      LineExtensionAmount:
        input[InvoiceModel.findKey(input, 'NetAmountInLines')],
      TaxExclusiveAmount:
        input[InvoiceModel.findKey(input, 'NetAmountWithoutTax')],
      TaxInclusiveAmount:
        input[InvoiceModel.findKey(input, 'NetAmountWithTax')],
      PayableAmount: input[InvoiceModel.findKey(input, 'PayableAmount')],
    };

    const optionalKeys = [
      {
        invoiceField: 'AllowanceTotalAmount',
        inputName: InvoiceModel.findKey(input, 'AllowanceTotalAmount'),
      },
      {
        invoiceField: 'ChargeTotalAmount',
        inputName: InvoiceModel.findKey(input, 'ChargeTotalAmount'),
      },
      {
        invoiceField: 'PrepaidAmount',
        inputName: InvoiceModel.findKey(input, 'PrepaidAmount'),
      },
      {
        invoiceField: 'PayableRoundingAmount',
        inputName: InvoiceModel.findKey(input, 'PayableRoundingAmount'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        parsed[invoiceField] = input[inputName];
      }
    });

    return parsed;
  }

  /**
   * Parse raw input data as a `InvoiceLine`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `InvoiceLine` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseInvoiceLine(input: object[]): InvoiceLineDetails[] {
    if (input.length < 1) {
      throw new Error('Must have at least one invoice line');
    }

    const parsed: InvoiceLineDetails[] = [];
    input.forEach((item) => {
      const parsedItem: InvoiceLineDetails = {
        ID: item[InvoiceModel.findKey(item, 'ID')],
        InvoicedQuantity: item[InvoiceModel.findKey(item, 'Quantity')],
        LineExtensionAmount: item[InvoiceModel.findKey(item, 'LineNetAmount')],
        Item: InvoiceModel.parseInvoiceLineItem(
          item[InvoiceModel.findKey(item, 'Item')],
        ),
        Price: InvoiceModel.parseInvoiceLinePrice(
          item[InvoiceModel.findKey(item, 'Price')],
        ),
      };

      const optionalKey = InvoiceModel.findKey(item, 'Note');
      if (optionalKey) {
        parsedItem.Note = item[optionalKey];
      }

      parsed.push(parsedItem);
    });

    return parsed;
  }

  /**
   * Parse raw input data as an `Item` inside an `InvoiceLine`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `Item` object corresponding to the UBL invoice specifications.
   * @memberof InvoiceModel
   */
  private static parseInvoiceLineItem(input: object): InvoiceLineItem {
    const parsed: InvoiceLineItem = {
      Name: input[InvoiceModel.findKey(input, 'Name')],
      ClassifiedTaxCategory: InvoiceModel.parseItemTaxCategory(
        input[InvoiceModel.findKey(input, 'TaxCategory')],
      ),
    };

    const optionalKey = InvoiceModel.findKey(input, 'Description');
    if (optionalKey) {
      parsed.Description = input[optionalKey];
    }

    return parsed;
  }

  /**
   * Parse raw input data as a `Price` inside an `InvoiceLine`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `Price` object corresponding to the UBL invoice specifications.
   * @memberof InvoiceModel
   */
  private static parseInvoiceLinePrice(input: object): InvoiceLinePrice {
    const parsed: InvoiceLinePrice = {
      PriceAmount: input[InvoiceModel.findKey(input, 'Amount')],
    };

    const optionalKey = InvoiceModel.findKey(input, 'Quantity');
    if (optionalKey) {
      parsed.BaseQuantity = input[optionalKey];
    }

    return parsed;
  }

  /**
   * Parse raw input data as a `TaxCategory` inside an `Item`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `TaxCategory` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private static parseItemTaxCategory(input: object): ItemTaxCategory {
    const parsed: ItemTaxCategory = {
      ID: input[InvoiceModel.findKey(input, 'ID')],
      TaxScheme: {
        ID: input[InvoiceModel.findKey(input, 'TaxScheme')],
      },
    };

    const optionalKey = InvoiceModel.findKey(input, 'Percent');
    if (optionalKey) {
      parsed.Percent = input[optionalKey];
    }

    return parsed;
  }

  /**
   * Parse a string containing raw input data.
   *
   * @param {string} invoiceString - A JSON string of the invoice.
   */
  public async parse(invoiceString: string): Promise<void> {
    const input = JSON.parse(invoiceString);

    // fix party stuff (Supplier, Buyer)

    this._invoiceData = {
      InvoiceTypeCode: input[InvoiceModel.findKey(input, 'InvoiceTypeCode')],
      DocumentCurrencyCode:
        input[InvoiceModel.findKey(input, 'InvoiceCurrency')],
      AccountingSupplierParty: {
        Party: InvoiceModel.parseParty(
          input[InvoiceModel.findKey(input, 'Supplier')],
        ),
      },
      AccountingCustomerParty: {
        Party: InvoiceModel.parseParty(
          input[InvoiceModel.findKey(input, 'Buyer')],
        ),
      },
      TaxTotal: InvoiceModel.parseTaxTotal(
        input[InvoiceModel.findKey(input, 'TaxTotal')],
      ),
      LegalMonetaryTotal: InvoiceModel.parseLegalMonetaryTotal(
        input[InvoiceModel.findKey(input, 'LegalMonetaryTotal')],
      ),
      InvoiceLine: InvoiceModel.parseInvoiceLine(
        input[InvoiceModel.findKey(input, 'InvoiceLine')],
      ),
    };

    const optionalKeys = [
      {
        invoiceField: 'CustomizationID',
        inputName: InvoiceModel.findKey(input, 'CustomizationID'),
      },
      {
        invoiceField: 'ProfileID',
        inputName: InvoiceModel.findKey(input, 'ProfileID'),
      },
      {
        invoiceField: 'ID',
        inputName: InvoiceModel.findKey(input, 'ID'),
      },
      {
        invoiceField: 'IssueDate',
        inputName: InvoiceModel.findKey(input, 'IssueDate'),
      },
      {
        invoiceField: 'DueDate',
        inputName: InvoiceModel.findKey(input, 'DueDate'),
      },
      {
        invoiceField: 'Note',
        inputName: InvoiceModel.findKey(input, 'Note'),
      },
      {
        invoiceField: 'TaxPointDate',
        inputName: InvoiceModel.findKey(input, 'TaxPointDate'),
      },
      {
        invoiceField: 'TaxCurrencyCode',
        inputName: InvoiceModel.findKey(input, 'TaxCurrency'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        this._invoiceData[invoiceField] = input[inputName];
      }
    });
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
      IssueDate: format(new Date(), 'yyyy-MM-dd'),
      ...JSON.parse(JSON.stringify(this.invoiceData)),
    };
    // Replace keys in clone with the UBL formatted xml field names
    InvoiceModel.replaceAllObjKeys(cloned, InvoiceModel.keyMethod);

    // Create the xml document
    const root = create(
      { version: '1.0', encoding: 'UTF-8' },
      {
        Invoice: {
          '@xmlns:cac':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
          '@xmlns:cbc':
            'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
          '@xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
          ...cloned,
        },
      },
    );
    const xml = root.end({ prettyPrint: true });

    console.log(xml);

    return xml;
  }
}
