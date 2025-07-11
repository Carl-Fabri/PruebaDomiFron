import { Component, inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Pelicula } from '../../core/models/Peliculas.model';
import { response } from 'express';
import { PeliculasService } from '../../services/peliculas.service';
import {MatCardModule} from '@angular/material/card';
import { FuncionesModalComponent } from '../component/funciones-modal/funciones-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatCardModule, MatFormFieldModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  dialog = inject(MatDialog);
  Film = inject(PeliculasService);
  filmsOnDisplay: Pelicula[] = [];

  constructor() {
  }

  ngOnInit() {
    this.#loadFilms();
  }

  #loadFilms() {
    this.Film.getPeliculas().subscribe({
      next: (response: Pelicula[]) => {
        this.filmsOnDisplay = response;
      },
      error: (error) => {
        console.error('Error loading films:', error);
      }
    });
  }

  abrirModalFunciones(peliculaId: number): void {
    console.log('Opening modal for movie ID:', peliculaId);
    const dialogRef = this.dialog.open(FuncionesModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: peliculaId, // Solo pasamos el ID
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      // Aquí puedes manejar la reserva o redireccionar
    }
  });
}

}
