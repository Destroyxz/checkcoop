import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jornada',
  templateUrl: './jornada.component.html'
})
export class JornadaComponent implements OnInit {
  horaActual: string = '';
  fechaActual: string = '';
  jornadaIniciada: boolean = false;
  horaEntrada: Date | null = null;
  horaSalida: Date | null = null;
  duracion: string = '';

  ngOnInit() {
    this.actualizarReloj();
    setInterval(() => this.actualizarReloj(), 1000);
  }

  actualizarReloj() {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString();
    this.fechaActual = ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  iniciarJornada() {
    this.horaEntrada = new Date();
    this.jornadaIniciada = true;
  }

  terminarJornada() {
    this.horaSalida = new Date();
    if (this.horaEntrada && this.horaSalida) {
      const ms = this.horaSalida.getTime() - this.horaEntrada.getTime();
      const horas = Math.floor(ms / (1000 * 60 * 60));
      const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      this.duracion = `${horas}h ${minutos}m`;
    }
    this.jornadaIniciada = false;
  }
}
