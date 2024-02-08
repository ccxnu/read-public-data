import { solicitarServicio } from "../Model/solicitarServicio";

export interface IServicioHttp
{
    solicitarServicio(solicitar: solicitarServicio) : Promise<any>;

}