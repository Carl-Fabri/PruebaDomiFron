import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Pelicula, PeliculaFuncion } from '../../../core/models/Peliculas.model';
import { Sala } from '../../../core/models/Sala.model';
import { Funcion } from '../../../core/models/Funcion.model';
import { FuncionesService } from '../../../services/funciones.service';
import { PeliculasService } from '../../../services/peliculas.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { SalasService } from '../../../services/salas.service';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { ReservasModalComponent } from '../reservas-modal/reservas-modal.component';

@Component({
  selector: 'app-funciones-modal',
  imports: [MatDialogModule,CommonModule,MatSelectModule,MatCardModule, MatFormFieldModule,MatDividerModule],
  templateUrl: './funciones-modal.component.html',
  styleUrl: './funciones-modal.component.scss'
})
export class FuncionesModalComponent {
  pelicula_funcion: PeliculaFuncion | null = null;
  salasDisponibles: Sala[] = [];
  funcionesDisponibles: Funcion[] = [];
  funcionesFiltradas: Funcion[] = [];
  funcionSeleccionada: Funcion | null = null;
  loading = true;
  error: string | null = null;

  // Funciones separadas por tipo de sala
  funcionesPremium: Funcion[] = [];
  funcionesStandard: Funcion[] = [];
  funcionesVIP: Funcion[] = [];

  Film = inject(PeliculasService);
  Funciones = inject(FuncionesService);
  Salas = inject(SalasService);
  dialog = inject(MatDialog);

  constructor(
    public dialogRef: MatDialogRef<FuncionesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public peliculaId: number,
  ) {
      dialogRef.disableClose = false;
  }

  ngOnInit(): void {
    this.#cargarDatosCompletos();
  }

  #cargarDatosCompletos(): void {
    this.loading = true;
    this.error = null;

    this.Film.getPelicula(this.peliculaId).subscribe({
      next: (pelicula: PeliculaFuncion) => {
        this.pelicula_funcion = pelicula;
        // Cargar funciones después de obtener la película
        this.#cargarFunciones(this.peliculaId);
      },
      error: (err) => {
        this.error = 'Error al cargar la película';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  #cargarFunciones(id: number): void {
    this.Funciones.getFuncionesPorPelicula(id).subscribe({
      next: (funciones: Funcion[]) => {
        this.funcionesDisponibles = funciones;
        this.#separarFuncionesPorTipoSala();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las funciones';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  #separarFuncionesPorTipoSala(): void {
    this.funcionesPremium = [];
    this.funcionesStandard = [];
    this.funcionesVIP = [];

    this.funcionesDisponibles.forEach(funcion => {
      const nombreSala = funcion.sala.toLowerCase();

      if (nombreSala.includes('premium')) {
        this.funcionesPremium.push(funcion);
      } else if (nombreSala.includes('standard')) {
        this.funcionesStandard.push(funcion);
      } else if (nombreSala.includes('vip')) {
        this.funcionesVIP.push(funcion);
      } else {
        console.warn('Tipo de sala no reconocido:', funcion.sala);
        this.funcionesStandard.push(funcion);
      }
    });
  }

  // Métodos auxiliares para obtener información de cada tipo
  getTipoSalaDisplay(tipo: string): string {
    switch (tipo) {
      case 'Premium':
        return 'Premium';
      case 'Standard':
        return 'Standard';
      case 'VIP':
        return 'VIP';
      default:
        return 'Standard';
    }
  }

  hasFuncionesPremium(): boolean {
    return this.funcionesPremium.length > 0;
  }

  hasFuncionesStandard(): boolean {
    return this.funcionesStandard.length > 0;
  }

  hasFuncionesVIP(): boolean {
    return this.funcionesVIP.length > 0;
  }

  confirmarSeleccion(): void {
    if (this.funcionSeleccionada) {
      // Abrir el modal de reservas con la función seleccionada
      const dialogRef = this.dialog.open(ReservasModalComponent, {
        width: '600px',
        maxWidth: '95vw',
        data: { funcionSeleccionada: this.funcionSeleccionada },
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si se completó la reserva, cerrar este modal también
          console.log('Reserva completada:', result);
          this.dialogRef.close(result);
        }
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  getDuracionFormateada(horaInicio: string, horaFin: string): string {
    const inicio = new Date(horaInicio);
    const fin = new Date(horaFin);

    const diferenciaMs = fin.getTime() - inicio.getTime();
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    } else {
      return `${minutos}min`;
    }
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
