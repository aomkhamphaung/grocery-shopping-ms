"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = exports.ValidationError = exports.BadRequestError = exports.APIError = exports.AppError = void 0;
const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
};
exports.STATUS_CODES = STATUS_CODES;
class AppError extends Error {
    constructor(name, description, statusCode, isOperational, errorStack, logingErrorResponse) {
        super(description);
        this.name = name;
        this.description = description;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        this.logError = logingErrorResponse;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class APIError extends AppError {
    constructor(name, statusCode = STATUS_CODES.INTERNAL_ERROR, description = "Internal Server Error", isOperational = true) {
        super(name, description, statusCode, isOperational);
    }
}
exports.APIError = APIError;
class BadRequestError extends AppError {
    constructor(description = "Bad request", logingErrorResponse) {
        super("NOT FOUND", description, STATUS_CODES.BAD_REQUEST, true, undefined, logingErrorResponse);
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends AppError {
    constructor(description = "Validation Error", errorStack) {
        super("BAD REQUEST", description, STATUS_CODES.BAD_REQUEST, true, errorStack);
    }
}
exports.ValidationError = ValidationError;
