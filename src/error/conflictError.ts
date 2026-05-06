import { HttpStatusCode } from 'axios';
import { CustomError } from './customError';
import { StatusMessages } from './statusCode';

export class ConflictError extends CustomError {
  constructor(message: string = StatusMessages.CONFLICT) {
    super(message, HttpStatusCode.Conflict);
  }
}

