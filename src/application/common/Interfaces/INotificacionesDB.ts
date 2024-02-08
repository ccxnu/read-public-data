import { Solicitud } from "../Model/solicitud";

export interface INotificacionesDB
{
    notificarProceso(solicitud: Solicitud, proceso: string, info_adicional: string);
}