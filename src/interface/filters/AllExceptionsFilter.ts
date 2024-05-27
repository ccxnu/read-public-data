import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // Aquí puedes personalizar la respuesta de acuerdo al tipo de excepción
    const error = {
      info: 'Ocurrió un error, intenta más tarde.',
      code: 'COD_ERROR_SERVICIO',
    };

    response.status(500).json(error);
  }
}
