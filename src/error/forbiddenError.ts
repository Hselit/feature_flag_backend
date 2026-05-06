import { HttpStatusCode } from 'axios';
import { CustomError } from './customError';
import { StatusMessages } from './statusCode';

export class ForbiddenError extends CustomError {
  constructor(message: string = StatusMessages.FORBIDDEN) {
    super(message, HttpStatusCode.Forbidden);
  }
}

