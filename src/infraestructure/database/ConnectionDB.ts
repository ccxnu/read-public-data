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

  //* Obtener resultado en formato json, de un insert, update o delete

  static async getResultDB(rows: any) {
    const data_string = JSON.stringify(rows);

    return JSON.parse(data_string);
  }

  //* Obtener parametros cargados en memoria

  getParametrosUnico(busqueda: string): Parametro {
    return this.parametros.find((e) => e.nom_unico == busqueda);
  }

  getParametrosGrupo(busqueda: string): Parametro[] {
    return this.parametros.filter((e) => e.nom_grupo == busqueda);
  }
  getParametrosPorValor(
    busqueda: string,
    servicio_id: number = null,
    entidad_id: number = null,
    tipo_valor = 'valor',
  ) {
    if (servicio_id == null)
      return this.parametros.find((e) => e[tipo_valor] == busqueda);

    return this.parametros.find(
      (e) =>
        e[tipo_valor] == busqueda &&
        e.servicio_id == servicio_id &&
        e.entidad_id == entidad_id,
    );
  }
  getParametroIfi(busqueda: string, entidad_id: number) {
    return this.parametros.find(
      (e) => e.nom_unico == busqueda && e.entidad_id == entidad_id,
    );
  }

  async saveToDatabase(data: any) {
    const connection = await this.getConnection();
    try {
      const [rows]: any[] = await connection.query(
        `SELECT ip_address, creation_datetime FROM GeoData WHERE ip_address = ?`,
        [data.ip],
      );
      if (rows.length === 0) {
        await connection.query(
          `INSERT INTO GeoData (ip_address, country, countryCode, region, regionName, city, zip, latitud, longitud, timezone, isp, org, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.ip,
            data.country,
            data.countryCode,
            data.region,
            data.regionName,
            data.city,
            data.zip,
            data.lat,
            data.lon,
            data.timezone,
            data.isp,
            data.org,
            data.proveedor,
          ],
        );
      } else {
        console.log(`IP ${data.ip} already exists in the database.`);
      }
    } finally {
      connection.release();
    }
  }
}
