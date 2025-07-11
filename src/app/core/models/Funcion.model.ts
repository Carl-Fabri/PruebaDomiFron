import { Pelicula } from "./Peliculas.model";
import { Sala } from "./Sala.model";

export interface Funcion {
  id: number;
  pelicula: Pelicula;
  sala: string;
  horaInicio: string;
  horaFin: string;
  entradasDisponibles: number;
}
