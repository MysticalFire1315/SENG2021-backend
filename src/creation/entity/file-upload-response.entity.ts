export class FileUploadResponseEntity {
  /**
   * A time estimate for how long it will take to parse the file.
   */
  timeEstimate: number;

  /**
   * A token associated with the uploaded file. This is to be used to retrieve
   * the UBL version of the file.
   */
  token: string;
}
