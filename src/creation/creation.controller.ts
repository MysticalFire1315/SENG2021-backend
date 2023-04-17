import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreationService } from './creation.service';
import { FileUploadDto } from './dto/file-upload.dto';
import { FilesUploadDto } from './dto/files-upload.dto';
import { InvoiceUploadResponseEntity } from './entities/invoice-upload-response.entity';
import { InvoicesUploadResponseEntity } from './entities/invoices-upload-response.entity';
import { StringUploadDto } from './dto/string-upload.dto';
import { StringsUploadDto } from './dto/strings-upload.dto';

@ApiTags('creation')
@Controller('api/creation')
export class CreationController {
  constructor(private creationService: CreationService) {}

  /**
   * Upload an invoice file.
   */
  @ApiHeader({
    name: 'type',
    description:
      'The format the invoice details in the uploaded file is in. Must be one' +
      ' of the following:\n- `json`\n- `xml`\n- `yaml`',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiCreatedResponse({ type: InvoiceUploadResponseEntity })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: FileUploadDto['file'],
    @Headers('type') type: string,
  ): Promise<InvoiceUploadResponseEntity> {
    const output = await this.creationService.invoiceUploadFile(file, type);
    return output;
  }

  /**
   * Upload an invoice string.
   */
  @ApiHeader({
    name: 'type',
    description:
      'The format the invoice details in the string is in. Must be one' +
      ' of the following:\n- `json`\n- `xml`\n- `yaml`',
  })
  @ApiBody({ type: StringUploadDto })
  @Post('upload/string')
  async uploadString(
    @Body('invoice') invoiceString: StringUploadDto['invoice'],
    @Headers('type') type: string,
  ): Promise<InvoiceUploadResponseEntity> {
    const output = await this.creationService.invoiceUploadString(
      invoiceString,
      type,
    );
    return output;
  }

  /**
   * Download the UML version of an uploaded invoice.
   */
  @ApiOkResponse({
    type: 'application/xml',
    schema: { type: 'string', format: 'binary' },
  })
  @ApiBadRequestResponse({
    description: 'File uploaded was unable to be parsed.',
    type: 'string',
  })
  @Get('download')
  @Header('Content-Type', 'application/xml')
  @Header('Content-Disposition', 'attachment; filename="invoice.xml"')
  async downloadFile(@Query('token') token: string): Promise<StreamableFile> {
    const output = await this.creationService.invoiceDownloadFile(token);
    return output;
  }

  /**
   * Get the UML version of an uploaded invoice.
   */
  @ApiOkResponse({
    type: 'application/xml',
  })
  @ApiBadRequestResponse({
    description: 'Invoice uploaded was unable to be parsed.',
    type: 'string',
  })
  @Get('download/string')
  async downloadString(@Query('token') token: string): Promise<string> {
    const output = await this.creationService.invoiceDownloadString(token);
    return output;
  }

  /**
   * Upload a batch of invoice files.
   */
  @ApiHeader({
    name: 'type',
    description:
      'The format the invoice details in the uploaded files are in. Must be ' +
      'one of the following:\n- `json`\n- `xml`\n- `yaml`',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilesUploadDto })
  @ApiCreatedResponse({ type: InvoicesUploadResponseEntity })
  @Post('upload/batch')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFileBatch(
    @UploadedFiles() files: FilesUploadDto['files'],
    @Headers('type') type: string,
  ): Promise<InvoicesUploadResponseEntity> {
    const output = await this.creationService.invoiceUploadBatchFile(
      files,
      type,
    );
    return output;
  }

  /**
   * Upload a batch of invoice strings.
   */
  @ApiHeader({
    name: 'type',
    description:
      'The format the invoice details in the strings are in. Must be ' +
      'one of the following:\n- `json`\n- `xml`\n- `yaml`',
  })
  @ApiBody({ type: StringsUploadDto })
  @ApiCreatedResponse({ type: InvoicesUploadResponseEntity })
  @Post('upload/batch/string')
  async uploadFileBatchString(
    @Body('invoices') invoiceStringArray: StringsUploadDto['invoices'],
    @Headers('type') type: string,
  ): Promise<InvoicesUploadResponseEntity> {
    const output = await this.creationService.invoiceUploadBatchString(
      invoiceStringArray,
      type,
    );
    return output;
  }
}
