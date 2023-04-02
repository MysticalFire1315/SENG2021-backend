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
import { convert, create } from 'xmlbuilder2';
import { format } from 'date-fns';
import * as yaml from 'js-yaml';
import { customAlphabet } from 'nanoid';
import { HttpException, HttpStatus } from '@nestjs/common';

export class InvoiceModel {
  // Attributes
  private _invoiceData: any;
  private currencyId = 'AUD';
  private error: Error = undefined;
  public static invoiceDefaults = {
    CustomizationID:
      'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    ProfileID: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
  };
  public static literals = ['@', '#'];
  private static nanoid = customAlphabet('1234567890', 16);

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
    let prefix = '';
    if (value instanceof Object) {
      prefix = 'cac:';
    } else if (!InvoiceModel.literals.includes(key.charAt(0))) {
      prefix = 'cbc:';
    }

    if (InvoiceModel.literals.includes(key.charAt(0))) {
      prefix = '';
    } else if (!(value instanceof Object)) {
      prefix = 'cbc:';
    } else if (
      Object.keys(value).find((objKey) =>
        InvoiceModel.literals.includes(objKey.charAt(0)),
      )
    ) {
      prefix = 'cbc:';
    } else {
      prefix = 'cac:';
    }
    return prefix + key;
  }

  private static fixAllDecimals(obj: object) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.fixAllDecimals(obj[key]);
      } else if (typeof obj[key] === 'number' && obj[key] !== null) {
        obj[key] = obj[key].toFixed(2);
      }
    });
  }

  /**
   * Strips a string of all non-alphabet characters and returns the lowercase
   * form of the string.
   *
   * @private
   * @static
   * @param {string} str The string to modify.
   * @return {string} The string without any non-alphabet characters and in
   * lowercase.
   * @memberof InvoiceModel
   */
  public static stripAndLower(str: string): string {
    return str.replace(/[^a-z]/gi, '').toLowerCase();
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
  private static findKey(obj: object, key: string): string {
    const newKey = Object.keys(obj).find(
      (objKey) => InvoiceModel.stripAndLower(objKey) === key.toLowerCase(),
    );
    if (newKey) {
      return newKey;
    } else {
      throw new HttpException(
        `Error: ${key} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private static findOptionalKey(obj: object, key: string): string {
    try {
      return this.findKey(obj, key);
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Parse raw input data as a `Party`.
   *
   * @private
   * @static
   * @param {object} input The input to parse.
   * @return The `Party` object corresponding to the UBL invoice specifications.
   * @memberof InvoiceModel
   */
  private parseParty(input: object): Party {
    // Parse compulsory fields
    const parsed: Party = {
      EndpointID: {
        '@schemeID':
          input[InvoiceModel.findKey(input, 'ElectronicAddressScheme')],
        '#': input[InvoiceModel.findKey(input, 'ElectronicAddress')],
      },
      PartyName: undefined,
      PostalAddress: this.parsePostalAddress(
        input[InvoiceModel.findKey(input, 'Address')],
      ),
      PartyLegalEntity: {
        RegistrationName: input[InvoiceModel.findKey(input, 'PersonName')],
      },
    };

    // Handle optional fields
    const partyNameKey = InvoiceModel.findOptionalKey(input, 'BusinessName');
    if (partyNameKey) {
      parsed.PartyName = {
        Name: input[partyNameKey],
      };
    } else {
      delete parsed.PartyName;
    }
    const companyIdKey = InvoiceModel.findOptionalKey(input, 'CompanyID');
    if (companyIdKey) {
      parsed.PartyLegalEntity.CompanyID = input[companyIdKey];
    }
    const contactKey = InvoiceModel.findOptionalKey(input, 'ContactInfo');
    if (contactKey) {
      parsed.Contact = this.parseContact(input[contactKey]);
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
  private parsePostalAddress(input: object): PostalAddressDetails {
    // Parse compulsory fields
    const parsed: any = {};

    // Handle optional fields
    const optionalKeys = [
      {
        invoiceField: 'StreetName',
        inputName: InvoiceModel.findOptionalKey(input, 'AddressLineOne'),
      },
      {
        invoiceField: 'AdditionalStreetName',
        inputName: InvoiceModel.findOptionalKey(input, 'AddressLineTwo'),
      },
      {
        invoiceField: 'CityName',
        inputName: InvoiceModel.findOptionalKey(input, 'City'),
      },
      {
        invoiceField: 'PostalZone',
        inputName: InvoiceModel.findOptionalKey(input, 'Postcode'),
      },
      {
        invoiceField: 'CountrySubentity',
        inputName: InvoiceModel.findOptionalKey(input, 'CountrySubdivision'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        parsed[invoiceField] = input[inputName];
      }
    });
    parsed.Country = {
      IdentificationCode: input[InvoiceModel.findKey(input, 'CountryCode')],
    };

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
  private parseContact(input: object): ContactDetails {
    const parsed: ContactDetails = {};

    const optionalKeys = [
      {
        invoiceField: 'Name',
        inputName: InvoiceModel.findOptionalKey(input, 'Name'),
      },
      {
        invoiceField: 'Telephone',
        inputName: InvoiceModel.findOptionalKey(input, 'Phone'),
      },
      {
        invoiceField: 'ElectronicMail',
        inputName: InvoiceModel.findOptionalKey(input, 'EMail'),
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
  private parseTaxTotal(input: object[]): TaxTotalDetails[] {
    const parsed: TaxTotalDetails[] = [];
    // Can have 1-2 instances
    if (Array.isArray(input)) {
      for (let i = 0; i < (input.length == 1 ? 1 : 2); i++) {
        parsed.push(this.parseOneTaxTotal(input[i]));
      }
    } else {
      parsed.push(this.parseOneTaxTotal(input));
    }

    return parsed;
  }

  /**
   * Parse raw input data as a `TaxTotal`.
   *
   * @private
   * @param {object} input The input to parse.
   * @return A `TaxTotal` object corresponding to the UBL invoice
   * specifications.
   * @memberof InvoiceModel
   */
  private parseOneTaxTotal(input: object): TaxTotalDetails {
    const parsedTax: TaxTotalDetails = {
      TaxAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'TaxAmount')]),
      },
    };

    const taxSubtotalKey = InvoiceModel.findOptionalKey(input, 'TaxSubtotal');
    if (taxSubtotalKey) {
      parsedTax.TaxSubtotal = this.parseTaxSubtotal(input[taxSubtotalKey]);
    }

    return parsedTax;
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
  private parseTaxSubtotal(input: object[]): TaxSubtotalDetails[] {
    const parsed: TaxSubtotalDetails[] = [];
    if (Array.isArray(input)) {
      input.forEach((item) => {
        parsed.push(this.parseOneTaxSubtotal(item));
      });
    } else {
      parsed.push(this.parseOneTaxSubtotal(input));
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
  private parseOneTaxSubtotal(input: object): TaxSubtotalDetails {
    const parsedTax: TaxSubtotalDetails = {
      TaxableAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'TaxableAmount')]),
      },
      TaxAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'TaxAmount')]),
      },
      TaxCategory: this.parseTaxCategory(
        input[InvoiceModel.findKey(input, 'TaxCategory')],
      ),
    };

    return parsedTax;
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
  private parseTaxCategory(input: object): TaxCategoryDetails {
    const parsed: any = { ID: input[InvoiceModel.findKey(input, 'ID')] };

    const optionalKeys = [
      {
        invoiceField: 'Percent',
        inputName: InvoiceModel.findOptionalKey(input, 'Percent'),
      },
      {
        invoiceField: 'TaxExemptionReason',
        inputName: InvoiceModel.findOptionalKey(input, 'ExemptionReason'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        if (invoiceField === 'Percent') {
          parsed[invoiceField] = Number(input[inputName]);
        } else {
          parsed[invoiceField] = input[inputName];
        }
      }
    });

    parsed.TaxScheme = {
      ID: input[InvoiceModel.findKey(input, 'TaxScheme')],
    };

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
  private parseLegalMonetaryTotal(input: object): LegalMonetaryTotalDetails {
    const parsed: any = {
      LineExtensionAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'NetAmountInLines')]),
      },
      TaxExclusiveAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'NetAmountWithoutTax')]),
      },
      TaxInclusiveAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'NetAmountWithTax')]),
      },
    };

    const optionalKeys = [
      {
        invoiceField: 'AllowanceTotalAmount',
        inputName: InvoiceModel.findOptionalKey(input, 'AllowanceTotalAmount'),
      },
      {
        invoiceField: 'ChargeTotalAmount',
        inputName: InvoiceModel.findOptionalKey(input, 'ChargeTotalAmount'),
      },
      {
        invoiceField: 'PrepaidAmount',
        inputName: InvoiceModel.findOptionalKey(input, 'PrepaidAmount'),
      },
      {
        invoiceField: 'PayableRoundingAmount',
        inputName: InvoiceModel.findOptionalKey(input, 'PayableRoundingAmount'),
      },
    ];

    optionalKeys.forEach(({ invoiceField, inputName }) => {
      if (inputName) {
        parsed[invoiceField] = {
          '@currencyID': this.currencyId,
          '#': Number(input[inputName]),
        };
      }
    });

    parsed.PayableAmount = {
      '@currencyID': this.currencyId,
      '#': Number(input[InvoiceModel.findKey(input, 'PayableAmount')]),
    };

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
  private parseInvoiceLine(input: object[]): InvoiceLineDetails[] {
    if (input.length < 1) {
      throw new HttpException(
        'Must have at least one invoice line',
        HttpStatus.BAD_REQUEST,
      );
    }

    const parsed: InvoiceLineDetails[] = [];
    if (Array.isArray(input)) {
      input.forEach((item) => {
        parsed.push(this.parseOneInvoiceLine(item));
      });
    } else {
      parsed.push(this.parseOneInvoiceLine(input));
    }

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
  private parseOneInvoiceLine(input: object): InvoiceLineDetails {
    const parsedItem: InvoiceLineDetails = {
      ID: input[InvoiceModel.findKey(input, 'ID')],
      Note: undefined,
      InvoicedQuantity: {
        '@unitCode': input[InvoiceModel.findKey(input, 'QuantityUnitCode')],
        '#': Number(input[InvoiceModel.findKey(input, 'Quantity')]),
      },
      LineExtensionAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'LineNetAmount')]),
      },
      Item: this.parseInvoiceLineItem(
        input[InvoiceModel.findKey(input, 'Item')],
      ),
      Price: this.parseInvoiceLinePrice(
        input[InvoiceModel.findKey(input, 'Price')],
      ),
    };

    const optionalKey = InvoiceModel.findOptionalKey(input, 'Note');
    if (optionalKey) {
      parsedItem.Note = input[optionalKey];
    } else {
      delete parsedItem.Note;
    }

    return parsedItem;
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
  private parseInvoiceLineItem(input: object): InvoiceLineItem {
    const parsed: InvoiceLineItem = {
      Description: undefined,
      Name: input[InvoiceModel.findKey(input, 'Name')],
      ClassifiedTaxCategory: this.parseItemTaxCategory(
        input[InvoiceModel.findKey(input, 'TaxCategory')],
      ),
    };

    const optionalKey = InvoiceModel.findOptionalKey(input, 'Description');
    if (optionalKey) {
      parsed.Description = input[optionalKey];
    } else {
      delete parsed.Description;
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
  private parseInvoiceLinePrice(input: object): InvoiceLinePrice {
    const parsed: InvoiceLinePrice = {
      PriceAmount: {
        '@currencyID': this.currencyId,
        '#': Number(input[InvoiceModel.findKey(input, 'Amount')]),
      },
    };

    const optionalKey = InvoiceModel.findOptionalKey(input, 'Quantity');
    if (optionalKey) {
      parsed.BaseQuantity = {
        '@unitCode': input[InvoiceModel.findKey(input, 'QuantityUnitCode')],
        '#': Number(input[optionalKey]),
      };
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
  private parseItemTaxCategory(input: object): ItemTaxCategory {
    const parsed: ItemTaxCategory = {
      ID: input[InvoiceModel.findKey(input, 'ID')],
      Percent: undefined,
      TaxScheme: {
        ID: input[InvoiceModel.findKey(input, 'TaxScheme')],
      },
    };

    const optionalKey = InvoiceModel.findOptionalKey(input, 'Percent');
    if (optionalKey) {
      parsed.Percent = Number(input[optionalKey]);
    } else {
      delete parsed.Percent;
    }

    return parsed;
  }

  /**
   * Parse a string containing raw input data.
   *
   * @param {string} invoiceString - A JSON string of the invoice.
   * @param {string} type - A string describing the type of input.
   */
  public async parse(invoiceString: string, type: string): Promise<void> {
    try {
      let input: any;
      if (InvoiceModel.stripAndLower(type) === 'json') {
        input = JSON.parse(invoiceString);
      } else if (InvoiceModel.stripAndLower(type) === 'xml') {
        input = convert(invoiceString, { format: 'object' });
        // Since 'input' must be root node, extract from there
        input = input[InvoiceModel.findKey(input, 'input')];
      } else if (InvoiceModel.stripAndLower(type) === 'yaml') {
        input = yaml.load(invoiceString, {
          schema: yaml.FAILSAFE_SCHEMA,
          json: true,
        });
      } else {
        // SHould not occur, but check anyways
        throw new Error('Invalid type!');
      }

      this.currencyId = input[InvoiceModel.findKey(input, 'InvoiceCurrency')];

      this._invoiceData = {};

      let optionalKeys = [
        {
          invoiceField: 'CustomizationID',
          inputName: InvoiceModel.findOptionalKey(input, 'CustomizationID'),
        },
        {
          invoiceField: 'ProfileID',
          inputName: InvoiceModel.findOptionalKey(input, 'ProfileID'),
        },
        {
          invoiceField: 'ID',
          inputName: InvoiceModel.findOptionalKey(input, 'ID'),
        },
        {
          invoiceField: 'IssueDate',
          inputName: InvoiceModel.findOptionalKey(input, 'IssueDate'),
        },
        {
          invoiceField: 'DueDate',
          inputName: InvoiceModel.findOptionalKey(input, 'DueDate'),
        },
      ];
      optionalKeys.forEach(({ invoiceField, inputName }) => {
        if (inputName) {
          this._invoiceData[invoiceField] = input[inputName];
        }
      });
      this._invoiceData.InvoiceTypeCode = String(
        input[InvoiceModel.findKey(input, 'InvoiceTypeCode')],
      );

      optionalKeys = [
        {
          invoiceField: 'Note',
          inputName: InvoiceModel.findOptionalKey(input, 'Note'),
        },
        {
          invoiceField: 'TaxPointDate',
          inputName: InvoiceModel.findOptionalKey(input, 'TaxPointDate'),
        },
      ];
      optionalKeys.forEach(({ invoiceField, inputName }) => {
        if (inputName) {
          this._invoiceData[invoiceField] = input[inputName];
        }
      });
      this._invoiceData.DocumentCurrencyCode = this.currencyId;

      optionalKeys = [
        {
          invoiceField: 'TaxCurrencyCode',
          inputName: InvoiceModel.findOptionalKey(input, 'TaxCurrency'),
        },
        {
          invoiceField: 'BuyerReference',
          inputName: InvoiceModel.findOptionalKey(input, 'BuyerReference'),
        },
      ];
      optionalKeys.forEach(({ invoiceField, inputName }) => {
        if (inputName) {
          this._invoiceData[invoiceField] = input[inputName];
        }
      });

      const orderRefKey = InvoiceModel.findOptionalKey(input, 'OrderReference');
      if (orderRefKey) {
        this._invoiceData['OrderReference']['ID'] = input[orderRefKey];
      }

      this._invoiceData = {
        ...this._invoiceData,
        AccountingSupplierParty: {
          Party: this.parseParty(
            input[InvoiceModel.findKey(input, 'Supplier')],
          ),
        },
        AccountingCustomerParty: {
          Party: this.parseParty(input[InvoiceModel.findKey(input, 'Buyer')]),
        },
        TaxTotal: this.parseTaxTotal(
          input[InvoiceModel.findKey(input, 'TaxTotal')],
        ),
        LegalMonetaryTotal: this.parseLegalMonetaryTotal(
          input[InvoiceModel.findKey(input, 'LegalMonetaryTotal')],
        ),
        InvoiceLine: this.parseInvoiceLine(
          input[InvoiceModel.findKey(input, 'InvoiceLine')],
        ),
      };
    } catch (e) {
      this.error = e;
    }
  }

  /**
   * Create a UBL document with the relevant attributes.
   *
   * @returns The generated UBL document as a string.
   */
  public async createUBL(): Promise<string> {
    // First check if parse ran into an error. If so, return the error as a
    // HTTP error
    if (this.error) {
      throw this.error;
    }

    // Make a deep clone of the invoice data and add necessary properties
    const cloned = {
      ...InvoiceModel.invoiceDefaults,
      ID: InvoiceModel.nanoid(),
      IssueDate: format(new Date(), 'yyyy-MM-dd'),
      ...JSON.parse(JSON.stringify(this.invoiceData)),
    };
    // Replace keys in clone with the UBL formatted xml field names
    InvoiceModel.replaceAllObjKeys(cloned, InvoiceModel.keyMethod);
    // Fix all numerical values to 2 decimal places
    InvoiceModel.fixAllDecimals(cloned);

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
    ).dtd();
    const xml = root.end({ prettyPrint: true });

    return xml;
  }
}
