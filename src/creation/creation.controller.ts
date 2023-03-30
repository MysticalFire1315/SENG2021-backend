import {
  Controller,
  Get,
  Header,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
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
import { FileUploadResponseEntity } from './entity/file-upload-response.entity';
import { FilesUploadResponseEntity } from './entity/files-upload-response.entity';

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
  @ApiCreatedResponse({ type: FileUploadResponseEntity })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: FileUploadDto['file'],
    @Headers('type') type: string,
  ): Promise<FileUploadResponseEntity> {
    try {
      const output = await this.creationService.invoiceUpload(file, type);
      return output;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
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
  async downloadFile(@Query('token') token: string) {
    try {
      const output = await this.creationService.invoiceDownload(token);
      return output;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
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
  @ApiCreatedResponse({ type: FilesUploadResponseEntity })
  @Post('upload/batch')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFileBatch(
    @UploadedFiles() files: FilesUploadDto['files'],
    @Headers('type') type: string,
  ): Promise<FilesUploadResponseEntity> {
    try {
      const output = await this.creationService.invoiceUploadBatch(files, type);
      return output;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
