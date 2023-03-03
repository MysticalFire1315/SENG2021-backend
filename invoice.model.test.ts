import { InvoiceModel } from 'src/models/invoice.model';

InvoiceSpecification invoiceData = {
  CustomizationID: 11,
  ProfileID: 22,
  ID: 33,
  IssueDate: 2010-11-09,
  DueDate: 2011-01-01,
  InvoiceTypeCode: 44,
  Note?: 'Ni Hao Ma?',
  TaxPointDate?: 2012-04-05,
  DocumentCurrencyCode: 55,
  TaxCurrencyCode?: '',
  AccountingSupplierParty: 
  AccountingBuyerParty: 
  TaxTotal: {
    TaxAmount:544,
    TaxSubtotal ?: {
      TaxableAmount: 444.56, 
      TaxAmount: 544.33,
      TaxCategory: {
        ID: '',
        Percent?: ,
        TaxExemptionReason?:,
        TaxScheme: { ID: };
      }
    }
  }
  LegalMonetaryTotal: {
    LineExtensionAmount:,
    TaxExclusiveAmount: ,
    TaxInclusiveAmount: ,
    AllowanceTotalAmount?:,
    ChargeTotalAmount?:,
    PrepaidTotalAmount?:,
    PayableRoundingAmount: ,
    PayableAmount: ,
  }
  InvoiceLine: ,
}
describe('test InvoiceModel parse', () => {
  test('test Only Mandatory Fields', () => {

  });
  test('test Mandatory Fields Missing', () => {});
  test('test Several Optional Fields', () => {});
  test('test All Optional Fields', () => {});
  test('test Multiple Invoice Line Mandatory Fields', () => { });
  test('test Multiple Invoice Line Optional Fields', () => { });
});

describe('test InvoiceModel createUBL', () => {
  test('test Only Mandatory Fields', () => { });
  test('test Mandatory Fields Missing', () => { });
  test('test Several Optional Fields', () => { });
  test('test All Optional Fields', () => { });
  test('Complex Mandatory Fields', () => { });
});