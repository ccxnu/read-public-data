import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { Parametro } from '../Common/Model/parametro';

@Injectable()
export class ConnectionDB {
  private static instance: ConnectionDB;
  private pool: mysql.Pool;
  public parametros: Parametro[];

  public constructor() {
    this.connect();
  }

  private async connect() {
    this.pool = mysql.createPool({
      user: process.env.USER_DB,
      host: process.env.HOST_DB,
      database: process.env.NAME_DB,
      password: process.env.PASS_DB,
      port: parseInt(process.env.PORT_DB) || 3600,
      connectionLimit: 50,
    });
  }

  // abrir una unica conexion a mysql, patron singleton(no abre y cierra conexiones cada que se realiza una consulta)
  static getInstance(): ConnectionDB {
    if (!ConnectionDB.instance) {
      ConnectionDB.instance = new ConnectionDB();
    }
    return ConnectionDB.instance;
  }

  //* Obtener la conexion actual activa, si no existe se crea en ese momento
  async getConnection() {
    return this.pool.getConnection();
  }
}
