import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcion } from '../core/models/Funcion.model';
import { Sala } from '../core/models/Sala.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  private _apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() { }

  getFuncionesPorPelicula(peliculaId: number): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${this._apiUrl}/Peliculas/${peliculaId}/funciones`);
  }

  getSalasDisponibles(): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${this._apiUrl}/api/Salas`);
  }
}
