import { Module } from '@nestjs/common';
import { ServicioHttp } from './infraestructure/Common/Http/servicioHttp';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './infraestructure/services/redis';
import { IpDataDB } from './infraestructure/database/IpDataDB';
import { ApiIpData } from './infraestructure/apis/apiIpData';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    RedisService,
    IpDataDB,
    ApiIpData,
    { provide: 'IServicioHttp', useClass: ServicioHttp },
  ],
})
export class AppModule {}
