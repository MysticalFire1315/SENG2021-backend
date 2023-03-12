import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreationService } from './creation.service';

@Controller('creation')
export class CreationController {
  constructor(private creationService: CreationService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const output = await this.creationService.invoiceUpload(file);
    return output;
  }

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

  @Post('upload/batch')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFileBatch(@UploadedFiles() files: Array<Express.Multer.File>) {
    const output = await this.creationService.invoiceUploadBatch(files);
    return output;
  }
}
