import axios from 'axios';
import { createReadStream, writeFileSync } from 'fs';
import tmp from 'tmp';
import { ApiError } from './error.api';

tmp.setGracefulCleanup();

export class ValidationApi {
  private axiosInstance = axios.create({
    baseURL: 'http://churros.eba-pyyazat7.ap-southeast-2.elasticbeanstalk.com/',
  });

  private async uploadFile(invoiceString: string): Promise<{
    statusCode: number;
    report_id: string;
  }> {
    // Create a temporary file to store invoice
    const tempFile = tmp.fileSync({ postfix: '.xml' });
    writeFileSync(tempFile.name, invoiceString);

    let response: { statusCode: number; report_id: string } = undefined;

    try {
      const axiosResponse = await this.axiosInstance.post(
        '/invoice/upload_file/v1',
        { file: createReadStream(tempFile.name) },
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      response = {
        statusCode: axiosResponse.status,
        report_id: axiosResponse.data.report_id,
      };
    } catch (error) {
      throw new ApiError({
        status: error.response.status,
        message: error.response.data.detail[0].msg,
      });
    }

    tempFile.removeCallback();

    return response;
  }

  private async downloadReport(
    report_id: string,
  ): Promise<{ statusCode: number; data: string }> {
    let response: { statusCode: number; data: string } = undefined;

    try {
      const axiosResponse = await this.axiosInstance.get(
        '/export/json_report/v1',
        { params: { report_id } },
      );
      response = { statusCode: axiosResponse.status, data: axiosResponse.data };
    } catch (error) {
      throw new ApiError({
        status: error.response.status,
        message: error.response.data.detail[0].msg,
      });
    }
    return response;
  }

  async request(invoiceString: string): Promise<boolean> {
    // Request to upload
    let uploadResponse = await this.uploadFile(invoiceString);

    // Delay for a bit to give server time to process request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let response: { statusCode: number; data: string } = undefined;

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

    return check_validations;
  }
}
