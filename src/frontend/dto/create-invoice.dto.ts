export class CreateInvoiceDto {
  invoiceid: string;
  issuedate: string;
  duedate: string;
  notes?: string;
  invoicecurrency: string;
  buyerreference: string;
  sellerelectronicaddress: string;
  sellerelectronicaddressscheme: string;
  sellercompany: string;
  selleraddress: string;
  sellercity: string;
  sellerpostcode: string;
  sellercountry: string;
  sellername: string;
  buyerelectronicaddress: string;
  buyerelectronicaddressscheme: string;
  buyercompany: string;
  buyeraddress: string;
  buyercity: string;
  buyerpostcode: string;
  buyercountry: string;
  buyername: string;
  // The following are for reference only.
  name?: string;
  cost?: number;
  description?: string;
  quantity?: number;
  unitcode?: string;
}
