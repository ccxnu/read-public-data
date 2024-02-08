import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceLocator
{
    private services = new Map<string, any>();

    register(name: string, service: any): void
    {
        this.services.set(name, service);
    }

    resolve(name: string): any
    {
        const service = this.services.get(name);
        if (!service)
        {
            throw new Error(`Service "${name}" not register in Service Locator`);
        }
        return service;
    }
}