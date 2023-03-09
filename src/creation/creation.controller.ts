import {
  Controller,
  Get,
  Param,
  Post,
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
  async downloadFile(@Param('token') token: string) {
    const output = await this.creationService.invoiceDownload(token);
    return output;
  }
}
