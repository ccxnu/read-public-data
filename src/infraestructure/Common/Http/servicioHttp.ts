import { Injectable } from "@nestjs/common";
import * as axios from 'axios';
import { solicitarServicio } from "../Model/solicitarServicio";
import { IServicioHttp } from "./IServicioHttp";


@Injectable()
export class ServicioHttp implements IServicioHttp
{
    async solicitarServicio(solicitar: solicitarServicio): Promise<any>
    {
        let respuesta: any = {};

        let req =
        {
            method: solicitar.metodo,
            url: solicitar.url_servicio,
            data: solicitar.data,
            headers: await this.addHeader(solicitar)
        };

        if (!solicitar.esperar_respuesta)
        {
            try
            {
                await axios.default(req);
            } catch (error) {}
        }
        else
        {
            respuesta = await axios.default(req);
            respuesta = respuesta.data;
        }
        return respuesta;

    }

    private async addHeader(solicitar: solicitarServicio)
    {
        let headers = {};

        if (solicitar.header_adicionales != undefined && solicitar.header_adicionales != null)
        {
            solicitar.header_adicionales.forEach(e => 
            {
                if (e.value != null && e.value != '')
                {
                    headers[e.key] = e.value;
                }
            }
            );
        }

        return headers;
    }

}