/**
 * Invoice specification
 * @namespace Invoice
 */
type InvoiceSpecification = {
  /**
   * An identification of the specification containing the total set of rules
   * to which the data contained in the instance document conforms.
   *
   * @name CustomizationID
   * @memberof Invoice
   * @cardinality 1..1
   * @optional defaults to `urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu
   * :2017:poacc:billing:3.0`
   */
  CustomizationID?: string;

  /**
   * Identifies the business process context in which the transaction appears.
   *
   * @name ProfileID
   * @memberof Invoice
   * @cardinality 1..1
   * @optional defaults to `urn:fdc:peppol.eu:2017:poacc:billing:01:1.0`
   */
  ProfileID?: string;

  /**
   * A unique identification of the Invoice.
   *
   * @name ID
   * @memberof Invoice
   * @cardinality 1..1
   * @optional defaults to a randomly generated sequence of digits
   */
  ID?: number;

  /**
   * The date when the Invoice was issued. Format "YYYY-MM-DD".
   *
   * @name IssueDate
   * @memberof Invoice
   * @cardinality 1..1
   * @optional defaults to the current date
   */
  IssueDate?: string;

  /**
   * The date when the payment is due. Format "YYYY-MM-DD".
   *
   * @name DueDate
   * @memberof Invoice
   * @cardinality 0..1
   * @optional
   */
  DueDate?: string;

  /**
   * A code specifying the functional type of the Invoice.
   *
   * @name InvoiceTypeCode
   * @memberof Invoice
   * @cardinality 1..1
   */
  InvoiceTypeCode: number;

  /**
   * A textual note that gives unstructured information that is relevant to the
   * Invoice as a whole.
   *
   * @name Note
   * @memberof Invoice
   * @cardinality 0..1
   * @optional
   */
  Note?: string;

  /**
   * The date when the VAT becomes accountable for the Seller and for the Buyer.
   * Format "YYYY-MM-DD".
   *
   * @name TaxPointDate
   * @memberof Invoice
   * @cardinality 0..1
   * @optional
   */
  TaxPointDate?: string;

  /**
   * The currency in which all Invoice amounts are given, except for the Total
   * VAT amount in accounting currency.
   *
   * @name DocumentCurrencyCode
   * @memberof Invoice
   * @cardinality 1..1
   */
  DocumentCurrencyCode: string;

  /**
   * The currency used for VAT accounting and reporting purposes as accepted or
   * required in the country of the Seller.
   *
   * @name TaxCurrencyCode
   * @memberof Invoice
   * @cardinality 0..1
   * @optional
   */
  TaxCurrencyCode?: string;

  /**
   * A group of business terms providing information about the Seller.
   *
   * @namespace AccountingSupplierParty
   * @memberof Invoice
   * @cardinality 1..1
   */
  AccountingSupplierParty: Party;

  /**
   * A group of business terms providing information about the Buyer.
   *
   * @namespace AccountingBuyerParty
   * @memberof Invoice
   * @cardinality 1..1
   */
  AccountingBuyerParty: Party;

  /**
   * When tax currency code is provided, two instances of the tax total must be
   * present, but only one with tax subtotal.
   *
   * @namespace TaxTotal
   * @memberof Invoice
   * @cardinality 1..2
   */
  TaxTotal: {
    /**
     * The total VAT amount for the Invoice or the VAT total amount expressed in
     * the accounting currency accepted or required in the country of the Seller.
     * Must be rounded to maximum 2 decimals.
     *
     * @name TaxAmount
     * @memberof TaxTotal
     * @cardinality 1..1
     */
    TaxAmount: number;

    /**
     * A group of business terms providing information about VAT breakdown by
     * different categories, rates and exemption reasons.
     *
     * @namespace TaxSubtotal
     * @memberof TaxTotal
     * @cardinality 0..n
     * @optional only if another instance of `TaxTotal` already contains this
     * field
     */
    TaxSubtotal?: {
      /**
       * Sum of all taxable amounts subject to a specific VAT category code and
       * VAT category rate (if the VAT category rate is applicable). Must be
       * rounded to maximum 2 decimals.
       *
       * @name TaxableAmount
       * @memberof TaxSubtotal
       * @cardinality 1..1
       */
      TaxableAmount: number;

      /**
       * The total VAT amount for a given VAT category. Must be rounded to
       * maximum 2 decimals.
       *
       * @name TaxAmount
       * @memberof TaxSubtotal
       * @cardinality 1..1
       */
      TaxAmount: number;

      /**
       * A group of business terms providing information about the VAT category.
       *
       * @namespace TaxCategory
       * @memberof TaxSubtotal
       * @cardinality 1..1
       */
      TaxCategory: {
        /**
         * Coded identification of a VAT category.
         *
         * @name ID
         * @memberof TaxCategory
         * @cardinality 1..1
         */
        ID: string;

        /**
         * The VAT rate, represented as percentage that applies for the relevant
         * VAT category.
         *
         * @name Percent
         * @memberof TaxCategory
         * @cardinality 0..1
         * @optional only if `ID` refers to tax exemption (is one of `E`, `G`,
         * `O` or `K`)
         */
        Percent?: number;

        /**
         * A textual statement of the reason why the amount is exempted from VAT
         * or why no VAT is being charged.
         *
         * @name TaxExemptionReason
         * @memberof TaxCategory
         * @cardinality 0..1
         * @optional only if `ID` refers to tax exemption (is one of `E`, `G`,
         * `O` or `K`)
         */
        TaxExemptionReason?: string;

        /**
         * The tax scheme under which tax falls.
         *
         * @name TaxScheme
         * @memberof TaxCategory
         * @cardinality 1..1
         * @optional defaults to `VAT`
         */
        TaxScheme: {
          ID: string;
        };
      };
    };
  };

  /**
   * A group of business terms providing the monetary totals for the Invoice.
   *
   * @namespace LegalMonetaryTotal
   * @memberof Invoice
   * @cardinality 1..1
   */
  LegalMonetaryTotal: Total;

  /**
   * A group of business terms providing information on individual Invoice
   * lines.
   *
   * @namespace InvoiceLine
   * @memberof Invoice
   * @cardinality 1..n
   */
  InvoiceLine: InvoiceLine[];
};

/**
 * All mentions of "Person" refers to either "Seller" or "Buyer", depending on
 * the parent namespace.
 *
 * @namespace Party
 * @memberof AccountingSupplierParty
 * @memberof AccountingCustomerParty
 */
type Party = {
  /**
   * Identifies the Person's electronic address to which the application level
   * response to the invoice may be delivered.
   *
   * @name EndpointID
   * @memberof Party
   * @cardinality 1..1
   */
  EndpointID: number;

  /**
   * A name by which the Person is known, other than Person name (also known as
   * Business name).
   *
   * @namespace PartyName
   * @memberof Party
   * @cardinality 0..1
   * @optional
   */
  PartyName?: { Name: string };

  /**
   * A group of business terms providing information about the address of the
   * Person.
   *
   * @namespace PostalAddress
   * @memberof Party
   * @cardinality 1..1
   */
  PostalAddress: {
    /**
     * The main address line in an address.
     *
     * @name StreetName
     * @memberof PostalAddress
     * @cardinality 0..1
     * @optional
     */
    StreetName?: string;

    /**
     * An additional address line in an address that can be used to give
     * further details supplementing the main line.
     *
     * @name AdditionalStreetName
     * @memberof PostalAddress
     * @cardinality 0..1
     * @optional
     */
    AdditionalStreetName?: string;

    /**
     * The common name of the city, town or village, where the Person's address
     * is located.
     *
     * @name CityName
     * @memberof PostalAddress
     * @cardinality 0..1
     * @optional
     */
    CityName?: string;

    /**
     * The identifier for an addressable group of properties according to the
     * relevant postal service.
     *
     * @name PostalZone
     * @memberof PostalAddress
     * @cardinality 0..1
     * @optional
     */
    PostalZone?: string;

    /**
     * The subdivision of a country.
     *
     * @name CountrySubentity
     * @memberof PostalAddress
     * @cardinality 0..1
     * @optional
     */
    CountrySubentity?: string;

    /**
     * The country in which the address is located.
     *
     * @namespace Country
     * @memberof PostalAddress
     * @cardinality 1..1
     */
    Country: {
      /**
       * A code that identifies the country.
       *
       * @name IdentificationCode
       * @memberof Country
       * @cardinality 1..1
       */
      IdentificationCode: string;
    };
  };

  /**
   * A group of business terms providing information about the Person.
   *
   * @namespace PartyLegalEntity
   * @memberof Party
   * @cardinality 1..1
   */
  PartyLegalEntity: {
    /**
     * The full name of the Person.
     *
     * @name RegistrationName
     * @memberof PartyLegalEntity
     * @cardinality 1..1
     */
    RegistrationName: string;

    /**
     * An identifier issued by an official registrar that identifies the Person
     * as a legal entity or person.
     *
     * @name CompanyID
     * @memberof PartyLegalEntity
     * @cardinality 0..1
     * @optional
     */
    CompanyID?: number;
  };

  /**
   * A group of business terms providing contact information relevant for the
   * Person.
   *
   * @namespace Contact
   * @memberof Party
   * @cardinality 0..1
   * @optional
   */
  Contact?: {
    /**
     * A contact point for a legal entity or person.
     *
     * @name Name
     * @memberof Contact
     * @cardinality 0..1
     * @optional
     */
    Name?: string;

    /**
     * A phone number for the contact point.
     *
     * @name Telephone
     * @memberof Contact
     * @cardinality 0..1
     * @optional
     */
    Telephone?: number;

    /**
     * An e-mail address for the contact point.
     *
     * @name ElectronicMail
     * @memberof Contact
     * @cardinality 0..1
     * @optional
     */
    ElectronicMail?: string;
  };
};
