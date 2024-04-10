const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorStack?: boolean;
  logError?: boolean;

  constructor(
    public name: string,
    public description: string,
    statusCode: number,
    isOperational: boolean,
    errorStack?: boolean,
    logingErrorResponse?: boolean
  ) {
    super(description);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logError = logingErrorResponse;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

// API Specific Errors
class APIError extends AppError {
  constructor(
    name: string,
    statusCode: number = STATUS_CODES.INTERNAL_ERROR,
    description: string = "Internal Server Error",
    isOperational: boolean = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}

// 400
class BadRequestError extends AppError {
  constructor(
    description: string = "Bad request",
    logingErrorResponse?: boolean
  ) {
    super(
      "NOT FOUND",
      description,
      STATUS_CODES.BAD_REQUEST,
      true,
      undefined,
      logingErrorResponse
    );
  }
}

// 400
class ValidationError extends AppError {
  constructor(description: string = "Validation Error", errorStack?: boolean) {
    super(
      "BAD REQUEST",
      description,
      STATUS_CODES.BAD_REQUEST,
      true,
      errorStack
    );
  }
}

export { AppError, APIError, BadRequestError, ValidationError, STATUS_CODES };
