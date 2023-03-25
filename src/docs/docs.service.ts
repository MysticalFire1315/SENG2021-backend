import { Injectable, StreamableFile } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DocsService {
  // async getLogs(): Promise<String> {
  //   const logs = readFileSync(join(process.cwd(), 'src/docs/changelog.txt'));
  //   console.log(logs.toString());
  //   return logs.toString();
  // }

  async getLogs(): Promise<StreamableFile> {
    return new StreamableFile(
      readFileSync(join(process.cwd(), 'src/docs/changelog.txt')),
    );
  }
}
