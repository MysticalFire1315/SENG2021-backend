import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  /**
   * A raw invoice data file in one of the allowed formats. See <docs/uploadFile
   * /specifications> for more details.
   */
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
