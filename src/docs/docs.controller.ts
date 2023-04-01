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

  /**
   * Download the input schema file for the `/api/creation/upload(s)` routes.
   */
  @ApiOkResponse({
    type: 'application/json',
    schema: { type: 'string', format: 'binary' },
  })
  @Get('schema/creation/upload')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="input.schema.json"')
  async getSchemaCreationUpload(): Promise<StreamableFile> {
    const output = await this.docsService.getSchemaCreationUpload();
    return output;
  }

  /**
   * Download the user guide for the API.
   */
  @ApiOkResponse({
    type: 'application/json',
    schema: { type: 'string', format: 'binary' },
  })
  @Get('guide')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="guide.md"')
  async getUserGuide(): Promise<StreamableFile> {
    const output = await this.docsService.getUserGuide();
    return output;
  }
}
