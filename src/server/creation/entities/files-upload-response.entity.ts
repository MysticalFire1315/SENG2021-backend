export class FilesUploadResponseEntity {
  /**
   * A time estimate for how long it will take to parse all the uploaded files.
   */
  timeEstimate: number;

  /**
   * An array of tokens associated with each uploaded file. Each token at any
   * index corresponds to the uploaded file at the same index. These tokens must
   * be used to retrieve the UBL version of the files one by one.
   */
  tokens: string[];
}
