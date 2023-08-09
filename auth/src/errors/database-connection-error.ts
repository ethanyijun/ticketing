import { BaseError } from "./base-error";

export class DatabaseConnectionError extends BaseError {
  reason = "Failed to connect to database";
  statusCode = 500;

  constructor() {
    super("Failed to connect to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
