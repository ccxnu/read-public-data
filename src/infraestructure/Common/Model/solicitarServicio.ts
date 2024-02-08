

export class solicitarServicio
{
    metodo: string = "POST";
    url_servicio: string;
    tipo_contenido: string = "application/json";
    key_autorizacion: string;
    value_autorization: string;
    header_adicionales: [{ value: string, key: string }];
    esperar_respuesta: boolean = true;
    data: any;
}