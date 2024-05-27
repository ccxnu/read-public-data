import {
  Body,
  Controller,
  Post,
  Headers,
  ValidationPipe,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { MetodosGenericos } from 'src/application/common/utils/metodos_genericos';
import { ServiceLocator } from 'src/application/common/utils/serviceLocator';

@UsePipes(new ValidationPipe())
@Controller('/api/internalServices')
export class InternalServicesController {
  constructor(private readonly serviceLocator: ServiceLocator) {}

  @HttpCode(200)
  @Post('/get')
  async get(@Body() body: any, @Headers() headers): Promise<any> {
    body = await MetodosGenericos.getDatosSolicutd(
      'VALIDAR_CREDENCIALES',
      headers,
      body,
    );
    return await this.serviceLocator
      .resolve('ValidarCredencialesHandler')
      .handle(body);
  }
}
