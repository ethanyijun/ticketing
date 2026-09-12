import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
  serializeError() {
    return [
      {
        message: this.message,
      },
    ];
  }
  reason = "Bad request error";
  statusCode = 400;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
