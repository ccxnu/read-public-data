import Redis from 'ioredis';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import isValidIP4 from 'src/application/common/utils/validateIp4';
import { IpDataDB } from '../database/IpDataDB';
import { ApiIpData } from '../apis/apiIpData';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private pollInterval: number;
  private cursor: string;
  private totalKeys: number;
  private matchPattern: string;

  constructor(
    private configService: ConfigService,
    private ipDataDB: IpDataDB,
    private apiIpData: ApiIpData,
  ) {
    this.pollInterval = parseInt(
      this.configService.get<string>('POLL_INTERVAL'),
      10,
    );

    this.totalKeys = parseInt(this.configService.get<string>('TOTAL_KEYS'), 10); // Convertir a número
    this.matchPattern = this.configService.get<string>('MATCH_PATTERN');
    this.cursor = '0';
  }

  onModuleInit() {
    this.handleDataFetch();
  }

  private async handleDataFetch() {
    const client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(this.configService.get<string>('REDIS_PORT'), 10),
    });
    try {
      const [nextCursor, keys] = await client.scan(
        this.cursor,
        'MATCH',
        this.matchPattern,
        'COUNT',
        this.totalKeys,
        'TYPE',
        'string',
      );

      for (const key of keys) {
        const value = await client.get(key);

        if (!isValidIP4(value)) continue; // Continuar si la clave no es ip4

        const data = await this.apiIpData.fetchIpApi(key);

        if (data === null) continue;

        const newData = {
          ip: value,
          country: data.country,
          countryCode: data.countryCode,
          region: data.region,
          regionName: data.regionName,
          city: data.city,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          proveedor: data.as,
        };
        await this.ipDataDB.saveIpData(newData);

        await client.del(key); // Eliminar la clave de Redis

        // Hacer que espere 1ms para evitar que la fetchIpApi se bloquee
        await new Promise((resolve) => setTimeout(resolve, 1));
      }

      this.cursor = nextCursor; // Actualizar el cursor
    } catch (error) {
      this.logger.error(`Error handling data fetch: ${error.message}`);
    } finally {
      await client.quit(); // Cerrar la conexión de Redis
      setTimeout(() => this.handleDataFetch(), this.pollInterval); // Tiempo
    }
  }
}
