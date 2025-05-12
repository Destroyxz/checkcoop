import { Component, OnInit } from '@angular/core';
import { JornadaService } from '../../services/jornada.service';
import { AuthService } from '../../services/login.service'; // Para obtener usuario_id

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
  usuario_id: number | null = null;

  // 🕘 Horarios esperados (pueden venir de BD más adelante)
  horaInicio1: string = '09:00';
  horaFin2: string = '17:00';

  // ✅ Estado para mostrar visualmente
  llegoTarde: boolean | null = null;
  cumplioJornada: boolean | null = null;

  constructor(
    private jornadaService: JornadaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = 6; // this.auth.getUser();
    if (!user) {
      console.error('Usuario no autenticado. Redirigiendo...');
      return;
    }

    this.usuario_id = 6;
    this.actualizarReloj();
    setInterval(() => this.actualizarReloj(), 1000);
  }

  actualizarReloj() {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString();
    this.fechaActual = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      // ✅ Calcular si llegó tarde
      const entradaStr = this.horaEntrada.toTimeString().slice(0, 8);
      const referencia = this.horaInicio1 + ':00';
      this.llegoTarde = entradaStr > referencia;

      // ✅ Calcular si cumplió jornada
      const horasTrabajadas = ms / 3600000; // ms a horas
      this.cumplioJornada = horasTrabajadas >= 7;

      const payload = {
        usuario_id: this.usuario_id,
        horaEntrada: this.formatearFecha(this.horaEntrada),
        horaSalida: this.formatearFecha(this.horaSalida)
      };

      this.jornadaService.guardarJornada(payload).subscribe({
        next: () => console.log('Jornada guardada'),
        error: err => console.error('Error al guardar jornada:', err)
      });
    }

    this.jornadaIniciada = false;
  }

  formatearFecha(fecha: Date | null): string {
    if (!fecha) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const y = fecha.getFullYear();
    const m = pad(fecha.getMonth() + 1);
    const d = pad(fecha.getDate());
    const h = pad(fecha.getHours());
    const min = pad(fecha.getMinutes());
    const s = pad(fecha.getSeconds());
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }
}
