import axios from 'axios';
import { createReadStream } from 'fs';
import { ApiError } from './error.api';

export class RenderingApi {
  private axiosInstance = axios.create({
    baseURL: 'https://macroservices.masterofcubesau.com/api/v2/',
  });

  private key: string = undefined;

  async setKey() {
    this.key = (await this.axiosInstance.get('/generatekey')).data.key;
  }

  async renderHtml(
    path: string,
  ): Promise<{ statusCode: number; data: string }> {
    if (this.key === undefined) {
      await this.setKey();
    }

    let response = undefined;
    try {
      const axiosResponse = await this.axiosInstance.post(
        '/invoice/render/html',
        { file: createReadStream(path), style: 0, language: 'en' },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'api-key': this.key,
          },
        },
      );
      response = { statusCode: axiosResponse.status, data: axiosResponse.data };
    } catch (error) {
      throw new ApiError({
        status: error.response.status,
        message: error.response.data.message,
      });
    }

    return response;
  }
}
