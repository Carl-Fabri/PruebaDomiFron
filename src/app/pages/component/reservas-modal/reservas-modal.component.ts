import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Reserva, Genero, TipoDocumento } from '../../../core/models/Reservas.model';
import { TicketReserva } from '../../../core/models/Ticket.model';
import { ReservasService } from '../../../services/reservas.service';
import { Funcion } from '../../../core/models/Funcion.model';

@Component({
  selector: 'app-reservas-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './reservas-modal.component.html',
  styleUrl: './reservas-modal.component.scss'
})
export class ReservasModalComponent {
  vista_ticket: boolean = false;
  ticketGenerado: TicketReserva | null = null;
  reservaService = inject(ReservasService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);

  reservaForm: FormGroup;
  loading: boolean = false;
  funcionSeleccionada: Funcion;

  // Opciones para los select
  generos: Genero[] = ['Masculino', 'Femenino', 'Otro'];
  tiposDocumento: TipoDocumento[] = ['DNI', 'Pasaporte', 'Carnet de Extranjería'];

  constructor(
    public dialogRef: MatDialogRef<ReservasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { funcionSeleccionada: Funcion },
  ) {
    this.funcionSeleccionada = data.funcionSeleccionada;
    dialogRef.disableClose = false;

    // Inicializar el formulario
    this.reservaForm = this.fb.group({
      funcionId: [this.funcionSeleccionada.id, [Validators.required]],
      cantidadEntradas: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const reservaData: Reserva = {
      ...this.reservaForm.value,
      fechaNacimiento: new Date(this.reservaForm.value.fechaNacimiento).toISOString()
    };

    this.reservaService.crearReserva(reservaData).subscribe({
      next: (response: TicketReserva) => {
        this.loading = false;
        this.ticketGenerado = response;
        this.vista_ticket = true;
        this.snackBar.open(`¡Reserva exitosa! Ticket: ${response.numeroTicket}`, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error al realizar la reserva', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Método para obtener mensajes de error específicos
  getErrorMessage(fieldName: string): string {
    const field = this.reservaForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `Mínimo ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Máximo ${field.errors?.['max'].max}`;
    }
    return '';
  }

  // Método para formatear la fecha y hora
  formatearFechaHora(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para formatear fecha desde Date object
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para cerrar el modal después de mostrar el ticket
  cerrarConTicket(): void {
    this.dialogRef.close(this.ticketGenerado);
  }
}
