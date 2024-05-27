import * as amqplib from 'amqplib';
import { Injectable } from '@nestjs/common';
import * as rabbit from 'src/json/rabbit.json';
import { RespuestaProcesos } from 'src/application/common/Model/respuestaProcesos';

@Injectable()
export class RabbitMQ {
  private static connection: amqplib.Connection = null;
  private static channel: amqplib.Channel;

  private static async getConnection(): Promise<amqplib.Connection> {
    if (this.connection == null) {
      this.connection = await amqplib.connect(rabbit.url);
      // Sender
      this.channel = await this.connection.createChannel();
    }
    return this.connection;
  }

  static async addQueue(
    data: string,
    queue: string,
    addLogTxt = true,
  ): Promise<RespuestaProcesos> {
    const respuesta = new RespuestaProcesos();
    try {
      await this.getConnection();
      this.channel.sendToQueue(queue, Buffer.from(data), { persistent: true });
    } catch (error) {
      respuesta.code = 'COD_ERR';
      respuesta.info = error;
      console.log(error);
      this.stopConsuming();
    }
    return respuesta;
  }

  static async stopConsuming() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Stopped consuming messages.');
    } catch (error) {
      console.log(error);
    }
    this.channel = null;
    this.connection = null;
  }
}
