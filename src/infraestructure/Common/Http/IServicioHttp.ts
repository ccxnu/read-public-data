import { SolicitarServicio } from '../Model/solicitarServicio';

export interface IServicioHttp {
  solicitarServicio(solicitar: SolicitarServicio): Promise<any>;
}
