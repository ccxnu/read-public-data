import * as crypto from 'crypto';
import { Solicitud } from '../Model/solicitud';

export class MetodosGenericos {
  public static getArmarError(respuesta): any {
    respuesta.info = 'Se presentó una incidencia, intenta más tarde.';
    respuesta.code = 'COD_ERROR_SERVICIO';
    respuesta.result = null;
    return respuesta;
  }

  public static addTipoError(error: any, tipo: string, nombre_recurso: string) {
    const armarErr = {
      ex: error.toString(),
      tipo_ex: tipo,
      clase_ex: nombre_recurso,
    };
    return JSON.stringify(armarErr);
  }

  public static async getTipoError(
    error: any,
    respuesta: any,
    id_usuario: any,
    clase: string,
    solicitud: Solicitud = null,
  ) {
    let message: string = error.message;

    if (message.indexOf('tipo_ex') == -1)
      message = this.addTipoError(message, 'CODIGO', clase);
    console.log(message);

    const getError = JSON.parse(message);

    const armarErr = {
      idInstitution: solicitud.idInstitution,
      idSolution: solicitud.idSolution,
      idUser: solicitud.idUser,
      idRequest: solicitud.idRequest,
      processDate: this.getFechaActual(),
      sender: solicitud.sender,
      login: solicitud.login,
      error: getError,
    };
    console.log(armarErr);

    return armarErr;
  }

  // obtener fecha actual
  public static getFechaActual(): string {
    const fecha_proceso = new Date();
    const optionsToFormat: any = {
      year: 'numeric', // año en formato numérico
      month: '2-digit', // mes en formato numérico de 2 dígitos
      day: '2-digit', // día en formato numérico de 2 dígitos
    };

    return (
      fecha_proceso.toLocaleDateString('en-us', optionsToFormat) +
      ' ' +
      fecha_proceso.toLocaleTimeString()
    );
  }

  // obtener un id único
  public static getIdRSolicitud(idrequest: string) {
    if (idrequest != undefined && idrequest.trim() != '') return idrequest;
    return crypto.randomUUID();
  }

  public static async getDatosSolicutd(req: any, headers: any, body: any) {
    body.idRequest = this.getIdRSolicitud(headers['idrequest']);
    body.processDate = this.getFechaActual();
    body.process = body.process ?? req;

    return body;
  }

  public static async getDatosRespuesta(solicitud: Solicitud, respuesta: any) {
    respuesta.idRequest = solicitud.idRequest;
    respuesta.idInstitution = solicitud.idInstitution;
    respuesta.idSolution = solicitud.idSolution;
    respuesta.idUser = solicitud.idUser;
    respuesta.processDate = this.getFechaActual();
    respuesta.sender = solicitud.sender;
    respuesta.process = solicitud.process;
    respuesta.login = solicitud.login;
    return respuesta;
  }

  public static getDateNotification() {
    const dateProcess = new Date();
    const optionsToFormat: any = {
      year: 'numeric', // año en formato numérico
      month: '2-digit', // mes en formato numérico de 2 dígitos
      day: '2-digit', // día en formato numérico de 2 dígitos
    };

    const response = {
      date: dateProcess.toLocaleDateString('en-GB', optionsToFormat),
      hour: dateProcess.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    return response;
  }
}
