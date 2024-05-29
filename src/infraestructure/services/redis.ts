import Redis from 'ioredis';
import axios from 'axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionDB } from 'src/infraestructure/database/ConnectionDB';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private pollInterval: number;
  private cursor: string;
  private totalKeys: string;
  private matchPattern: string;

  constructor(
    private configService: ConfigService,
    private connectionDB: ConnectionDB,
  ) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(this.configService.get<string>('REDIS_PORT'), 10),
    });
    this.pollInterval = parseInt(
      this.configService.get<string>('POLL_INTERVAL'),
      10,
    );

    this.totalKeys = this.configService.get<string>('TOTAL_KEYS');
    this.matchPattern = this.configService.get<string>('MATCH_PATTERN');
    this.cursor = '0';
  }

  onModuleInit() {
    this.handleDataFetch();
  }

  private async fetchIPInfo(ip: string) {
    try {
      const response = await axios.get(
        `${this.configService.get<string>('IP_API_URL')}/${ip}`,
      );
      if (response.data.status === 'fail') {
        this.logger.error(
          `Error fetching info for ${ip}: ${response.data.message}`,
        );
        return null;
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching IP info for ${ip}: ${error.message}`);
      return null;
    }
  }

  private async handleDataFetch() {
    try {
      const [nextCursor, keys] = await this.client.scan(
        this.cursor,
        'MATCH',
        this.matchPattern,
        'COUNT',
        this.totalKeys,
        'TYPE',
        'string',
      );

      // TODO: Ver si actualizar o no el cursor
      this.cursor = nextCursor;

      for (const key of keys) {
        const value = await this.client.get(key);

        // if (!value) {
        //   this.logger.error(`Error fetching value for ${key}`);
        //   continue;
        // }

        const data = await this.fetchIPInfo(value);

        if (data === null) {
          //await this.client.del(key); // Eliminar la clave de Redis después
          continue;
        }

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
        await this.connectionDB.saveToDatabase(newData);

        //await this.client.del(key); // Eliminar la clave de Redis después
      }
    } catch (error) {
      this.logger.error(`Error handling data fetch: ${error.message}`);
    } finally {
      setTimeout(() => this.handleDataFetch(), this.pollInterval); // Tiempo
    }
  }
}
