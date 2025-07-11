export interface TicketReserva {
  id: number;
  numeroTicket: string;
  pelicula: string;
  sala: string;
  horaInicio: Date;
  horaFin: Date;
  cantidadEntradas: number;
  fechaReserva: Date;
  cliente: Cliente;
}

export interface Cliente {
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
}
