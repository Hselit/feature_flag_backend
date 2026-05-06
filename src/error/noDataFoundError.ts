import { HttpStatusCode } from 'axios';
import { CustomError } from './customError';

export class NoDataFoundError extends CustomError {
  constructor(message = 'No data found') {
    super(message, HttpStatusCode.NotFound);
  }
}

