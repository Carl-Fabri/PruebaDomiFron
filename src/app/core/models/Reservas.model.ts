export interface Reserva {
  funcionId: number;
  cantidadEntradas: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // o Date si prefieres manejar objetos Date
  genero: Genero;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  email: string;
}
export type Genero = 'Masculino' | 'Femenino' | 'Otro' | string;
export type TipoDocumento = 'DNI' | 'Pasaporte' | 'Carnet de Extranjería' | string;
