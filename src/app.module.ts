import { Module } from '@nestjs/common';
import { ServiceLocator } from './application/common/utils/serviceLocator';
import { ApiLogs } from './infraestructure/apis/apiLogs';
import { ServicioHttp } from './infraestructure/Common/Http/servicioHttp';
import { InternalServicesController } from './interface/controller/internalServices.controller';
import { DataModule } from './data/data.module';

@Module({
  providers: [
    ServiceLocator,
    { provide: 'IServicioHttp', useClass: ServicioHttp },
    { provide: 'IApiLogs', useClass: ApiLogs },
  ],
  controllers: [InternalServicesController],
  imports: [DataModule],
})
export class AppModule {
  constructor(private readonly serviceLocator: ServiceLocator) {}
}
