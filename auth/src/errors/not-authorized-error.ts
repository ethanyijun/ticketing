import { BaseError } from "./base-error";

export class NotAuthorizedError extends BaseError {
  reason = "Not authorized";
  statusCode = 401;

  constructor() {
    super("Not authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
