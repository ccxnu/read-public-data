export class SolicitarServicio {
  metodo = 'POST';
  url_servicio: string;
  tipo_contenido = 'application/json';
  key_autorizacion?: string;
  value_autorizacion?: string;
  header_adicionales?: { key: string; value: string }[] = [];
  esperar_respuesta = true;
  data?: any;
}
