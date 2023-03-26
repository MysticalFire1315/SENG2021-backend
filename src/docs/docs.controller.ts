import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private docsService: DocsService) {}

  /**
   * Download the changelog file for this API.
   */
  @ApiOkResponse({
    type: 'application/json',
    schema: { type: 'string', format: 'binary' },
  })
  @Get('changelog')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="changes.log"')
  async getLogs(): Promise<StreamableFile> {
    const output = await this.docsService.getLogs();
    return output;
  }
}
