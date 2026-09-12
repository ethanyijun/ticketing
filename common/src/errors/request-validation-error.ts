import { ValidationError } from "express-validator";
import { BaseError } from "./base-error";

export class RequestValidationError extends BaseError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Request validation failed");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return {
          message: err.msg,
          field: err.path,
        };
      }
      return {
        message: err.msg,
      };
    });
  }
}
