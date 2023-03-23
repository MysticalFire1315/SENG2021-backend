import { ApiProperty } from '@nestjs/swagger';

export class FilesUploadDto {
  /**
   * An array of raw invoice data files in one of the allowed formats. See 
   * <docs/uploadFile/specifications> for more details.
   */
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: Express.Multer.File[];
}
