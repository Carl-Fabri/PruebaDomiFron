import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../core/models/Reservas.model';
import { TicketReserva } from '../core/models/Ticket.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private _apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() { }

  crearReserva(reservaData: Reserva): Observable<TicketReserva> {
    return this.http.post<TicketReserva>(`${this._apiUrl}/Reservas`, reservaData);
  }
}
