import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreationService } from './creation.service';

@Controller('creation')
export class CreationController {
  constructor(private creationService: CreationService) {}

  // Routes here

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
}
