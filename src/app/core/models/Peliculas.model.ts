import { Funcion } from "./Funcion.model";

export interface Pelicula {
  id: number;
  titulo: string;
  duracionMinutos: number;
  genero: string;
  clasificacion: string;
  imagenUrl?: string;
  sinopsis?: string;
}

export interface PeliculaFuncion {
  id: number;
  titulo: string;
  duracionMinutos: number;
  genero: string;
  clasificacion: string;
  imagenUrl?: string;
  sinopsis?: string;
  funciones: Funcion[];
}

