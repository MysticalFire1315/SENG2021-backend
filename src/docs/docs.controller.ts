import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DocsService } from './docs.service';

@ApiTags('documentation')
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
   * Get the user guide for the API.
   */
  @Get('guide')
  async getUserGuide(): Promise<string> {
    const output = await this.docsService.getUserGuide();
    return output;
  }

  /**
   * Download the requests log file for this API. (This includes requests to
   * the /frontend routes).
   */
  @ApiOkResponse({
    type: 'application/json',
    schema: { type: 'string', format: 'binary' },
  })
  @Get('changelog')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="requests.log"')
  async getRequestLogs(): Promise<StreamableFile> {
    const output = await this.docsService.getRequestLogs();
    return output;
  }
}
