import { Inject, Injectable } from '@nestjs/common';
import { IServicioHttp } from '../Common/Http/IServicioHttp';
// Interface?
// Json?

@Injectable()
export class RedisLogs {

  constructor(private readonly dataService: DataService) {}

  @Get('/')
  async getAllData() {
    console.log('working...');
  }

  @Get('/:key')
  async getData(@Param('key') key: string) {
    const value = await this.dataService.getFromCache(key);

    return { status: 'success', value };
  }
}
  async addRespuesta(respuesta: any) {
    try {
      const data = {
        name_db: this.name_db,
        collection: 'response',
        object: { ...respuesta },
      };

      await RabbitMQ.addQueue(JSON.stringify(data), rabbit.queue_logs);
    } catch (error) {
      console.log('log res: ' + error);
    }
  }
}
