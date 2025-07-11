import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Pelicula, PeliculaFuncion } from '../core/models/Peliculas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private _apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {
  }

  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this._apiUrl}/peliculas`);
  }

  getPelicula(id: number): Observable<PeliculaFuncion> {
    return this.http.get<PeliculaFuncion>(`${this._apiUrl}/Peliculas/${id}`);
  }

}
