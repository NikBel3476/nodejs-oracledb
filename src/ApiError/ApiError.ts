export class ApiError extends Error {
  status: number;
  errors: unknown[];

  constructor(message: string, status: number, errors: unknown[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string) {
    return new ApiError(message, 400, []);
  }

  static internal(message: string) {
    return new ApiError(message, 500, []);
  }
}
