import axios from 'axios';
import { createReadStream, writeFileSync } from 'fs';
import * as tmp from 'tmp';
import { ApiError } from './error.api';

tmp.setGracefulCleanup();

export class CreationApi {
  private axiosInstance = axios.create({
    baseURL:
      'http://seng2021-f12a-api-env.eba-pymctycp.ap-southeast-2.elasticbeanstalk.com/',
  });

  private async uploadFile(
    invoiceString: string,
    invoiceType: string,
  ): Promise<{
    statusCode: number;
    data: { timeEstimate: number; token: string };
  }> {
    // Create a temporary file to store invoice
    const tempFile = tmp.fileSync({ postfix: '.' + invoiceType });
    writeFileSync(tempFile.name, invoiceString);

    let response = undefined;

    try {
      const axiosResponse = await this.axiosInstance.post(
        '/api/creation/upload',
        { file: createReadStream(tempFile.name) },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            type: invoiceType,
          },
        },
      );
      response = { statusCode: axiosResponse.status, data: axiosResponse.data };
    } catch (error) {
      throw new ApiError({
        status: error.response.data.statusCode,
        message: error.response.data.message,
      });
    }

    tempFile.removeCallback();

    return response;
  }

  private async downloadFile(
    token: string,
  ): Promise<{ statusCode: number; data: string }> {
    let response = undefined;

    try {
      const axiosResponse = await this.axiosInstance.get(
        '/api/creation/download',
        {
          params: { token },
        },
      );
      response = { statusCode: axiosResponse.status, data: axiosResponse.data };
    } catch (error) {
      throw new ApiError({
        status: error.response.data.statusCode,
        message: error.response.data.message,
      });
    }
    return response;
  }

  async request(invoiceString: string, invoiceType: string): Promise<string> {
    // Request to upload
    const uploadResponse = await this.uploadFile(invoiceString, invoiceType);

    // Attempt request to download, keep looping if unsuccessful with 503 code
    let response: { statusCode: number; data: string } = {
      statusCode: 503,
      data: '',
    };
    while (response.statusCode === 503) {
      // Delay for given timeout
      await new Promise((resolve) =>
        setTimeout(resolve, uploadResponse.data.timeEstimate),
      );
      try {
        response = await this.downloadFile(uploadResponse.data.token);
      } catch (error) {
        if (error.status === 503) {
          response.statusCode = 503;
        } else {
          throw error;
        }
      }
    }

    return response.data;
  }
}
