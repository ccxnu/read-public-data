import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class DataService {
  private client: any;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client.connect();
  }

  async getFromCache(key: string) {
    return new Promise((resolve, reject) => {
      this.client.Get(key, (err: Error, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
