import axios from 'axios';
import { createReadStream, writeFileSync } from 'fs';
import tmp from 'tmp';

tmp.setGracefulCleanup();

export class CreationApi {
  private axiosInstance = axios.create({
    baseURL:
      'http://seng2021-f12a-api-env.eba-pymctycp.ap-southeast-2.elasticbeanstalk.com/',
  });

  private uploadFile(invoiceString: string, invoiceType: string) {
    const tempFile = tmp.fileSync({ postfix: '.json' });
    writeFileSync(tempFile.name, invoiceString);

    const response = this.axiosInstance.post(
      '/api/creation/upload',
      { file: createReadStream(tempFile.name) },
      {
        headers: { 'Content-Type': 'multipart/form-data', type: invoiceType },
      },
    );

    tempFile.removeCallback();

    return response;
  }

  private downloadFile(token: string) {
    return this.axiosInstance.get('/api/creation/download', {
      params: { token },
    });
  }

  async request(invoiceString: string, invoiceType: string): Promise<String> {
    const token = await this.uploadFile(invoiceString, invoiceType);
    const response = await this.downloadFile(token.data.token);

    return response.data;
  }
}
