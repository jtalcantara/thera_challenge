import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let errors: any = null;

    // Check if the exception is an HttpException (NestJS)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        errors = responseObj.errors || null;
      }
    } 
    
    // Check if the exception is an Error
    else if (exception instanceof Error) {
      message = exception.message;
      errors = null;
    }

    const formattedResponse = {
      success: false,
      data: null,
      errors: errors || message,
      statusCode: status,
      message: typeof message === 'string' ? message : (Array.isArray(message) ? message.join(', ') : 'An error occurred'),
    };

    response.status(status).json(formattedResponse);
  }
}
