import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IApiIpData } from 'src/application/common/Interfaces/apis/IApiIpData';
import { IServicioHttp } from '../Common/Http/IServicioHttp';
import { SolicitarServicio } from '../Common/Model/solicitarServicio';

@Injectable()
export class ApiIpData implements IApiIpData {
  private readonly logger = new Logger(ApiIpData.name);

  constructor(
    private configService: ConfigService,
    @Inject('IServicioHttp') private servicioHttp: IServicioHttp,
  ) {}

  async fetchIpApi(ip: string) {
    try {
      const request = new SolicitarServicio();
      request.metodo = 'GET';
      request.url_servicio = `${this.configService.get<string>(
        'IP_API_URL',
      )}/${ip}`;
      request.esperar_respuesta = true;

      const response = await this.servicioHttp.solicitarServicio(request);

      if (response.status === 'fail') {
        this.logger.error(`Error fetching info for ${ip}: ${response.message}`);
        return null;
      }

      return response;
    } catch (error) {
      this.logger.error(`Error fetching IP info for ${ip}: ${error.message}`);
      return null;
    }
  }
}
