import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  invoiceList = [];

  invoiceCreate(): Promise<any> {
    return new Promise((resolve) => {
      resolve(/* do something here */)
    });
  }

  invoiceReceive(): Promise<any> {
    return new Promise((resolve) => {
      resolve(/* do something here */)
    });
  }
}
