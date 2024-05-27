export class solicitarServicio {
  metodo = 'POST';
  url_servicio: string;
  tipo_contenido = 'application/json';
  key_autorizacion: string;
  value_autorization: string;
  header_adicionales: [{ value: string; key: string }];
  esperar_respuesta = true;
  data: any;
}
