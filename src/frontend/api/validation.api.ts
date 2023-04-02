import axios from 'axios';
import { createReadStream, writeFileSync } from 'fs';
import * as tmp from 'tmp';
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
  ): Promise<{ statusCode: number; data: object }> {
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

  private getViolations(apiResponse: object): string[] {
    const evaluations = {
      wellformedness: apiResponse['wellformedness_evaluation'],
      schema: apiResponse['schema_evaluation'],
      syntax: apiResponse['syntax_evaluation'],
      peppol: apiResponse['peppol_evaluation'],
    };

    const violations: string[] = [];
    Object.values(evaluations).forEach((evaluation) => {
      if (evaluation) {
        evaluation.violations.forEach((violation) =>
          violations.push(violation.message),
        );
      }
    });

    return violations;
  }

  async request(invoiceString: string): Promise<string[]> {
    // Request to upload
    const uploadResponse = await this.uploadFile(invoiceString);

    // Delay for a bit to give server time to process request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await this.downloadReport(uploadResponse.report_id);

    return this.getViolations(response.data);
  }
}
