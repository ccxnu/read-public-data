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
    this.pool = await mysql.createPool({
      user: process.env.USER_DB,
      host: process.env.HOST_DB,
      database: process.env.NAME_DB,
      password: process.env.PASS_DB,
      port: parseInt(process.env.PORT_DB) || 3600,
      connectionLimit: 50,
    });

    try {
      const sql_param = `select servicio_id, entidad_id, case habilitado when 1 then true else false end habilitado, nom_grupo, nom_unico, valor, valor_2, descripcion, id_param from parametros_institucion join parametros on id_param = param_id where nom_grupo in ('POLITICAS', 'OTP_CONFIRMACION');`;
      const cliente = await this.getConnection();
      const [rows, fields] = await cliente.query(sql_param);
      cliente.release();
      this.parametros = await ConnectionDB.getResultDB(rows);
    } catch (error) {
      console.log('Error al traer parametros ' + error);
    }
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
}
