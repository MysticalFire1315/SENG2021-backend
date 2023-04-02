export class ApiError extends Error {
  public readonly status: number;
  constructor(data: { status: number; message: string }) {
    super(data.message);
    this.status = data.status;
  }
}
