import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private docsService:DocsService) {}

  @Get('logs')
  @Header('Content-Disposition', 'attachment; filename="changes.log"')
  async getLogs(): Promise<StreamableFile> {
    const output = await this.docsService.getLogs();
    return output;
  }
}
