import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Aquí puedes personalizar la respuesta de acuerdo al tipo de excepción
    const error = {
      info: exception.message,
      code: 'COD_ERROR_HTTP',
    };
    console.log(exception);

    response.status(status).json(error);
  }
}
