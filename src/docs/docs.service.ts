import {
  Injectable,
  OnApplicationShutdown,
  StreamableFile,
} from '@nestjs/common';
import { readFileSync, rmSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DocsService implements OnApplicationShutdown {
  private static docsPath = join(process.cwd(), 'src/docs/static/');

  /**
   * Remove request logs on application end.
   */
  onApplicationShutdown() {
    rmSync(join(process.cwd(), 'src/docs/static/requests.log'), {
      force: true,
      recursive: true,
    });
  }

  /**
   * Get the changelog file as a NestJS streamable file.
   *
   * @returns The contents of the changelog file as a streamable file
   */
  async getLogs(): Promise<StreamableFile> {
    return new StreamableFile(
      readFileSync(DocsService.docsPath + 'changelog.txt'),
    );
  }

  /**
   * Get the input schema file for the `api/creation/upload(s)` routes as a
   * NestJS streamable file.
   *
   * @returns The contents of the schema file as a streamable file
   */
  async getSchemaCreationUpload(): Promise<StreamableFile> {
    return new StreamableFile(
      readFileSync(DocsService.docsPath + 'input.schema.json'),
    );
  }

  async getUserGuide(): Promise<string> {
    return readFileSync(DocsService.docsPath + 'guide.html').toString();
  }

  async getRequestLogs(): Promise<StreamableFile> {
    return new StreamableFile(
      readFileSync(DocsService.docsPath + 'requests.log'),
    );
  }
}
