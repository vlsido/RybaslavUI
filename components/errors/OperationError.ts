export class OperationError extends Error {
  name: string;
  code: string;
  message: string;

  constructor(
    code: string, message: string
  ) {
    super(`{"${code}": "${message}"}`);

    this.name = "OperationError";
    this.code = code;
    this.message = "";

    Object.setPrototypeOf(
      this,
      OperationError.prototype
    );
  }

}
