import { Module } from '@nestjs/common';
import { ServiceLocator } from './application/common/utils/serviceLocator';
import { ApiLogs } from './infraestructure/apis/apiLogs';
import { ServicioHttp } from './infraestructure/Common/Http/servicioHttp';
//import { InternalServicesController } from './interface/controller/internalServices.controller';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './infraestructure/services/redis';
import { ConnectionDB } from './infraestructure/database/ConnectionDB';
import { IPublicDataDB } from './infraestructure/database/IpPublicData';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    RedisService,
    IPublicDataDB,
    ServiceLocator,
    { provide: 'IServicioHttp', useClass: ServicioHttp },
    { provide: 'IApiLogs', useClass: ApiLogs },
  ],
  //controllers: [InternalServicesController],
})
export class AppModule {}
