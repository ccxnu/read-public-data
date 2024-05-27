import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('/api/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('/:key')
  async getData(@Param('key') key: string) {
    const value = await this.dataService.getFromCache(key);

    return { status: 'success', value };
  }
}
