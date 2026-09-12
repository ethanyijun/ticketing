import { BaseError } from "./base-error";

export class NotAuthenticatedError extends BaseError {
  reason = "Not authenticated";
  statusCode = 401;

  constructor() {
    super("Not authenticated");
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }
  serializeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
