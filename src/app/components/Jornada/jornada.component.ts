import { Component, OnInit } from '@angular/core';
import { JornadaService } from '../../services/jornada.service';
import { Modal } from 'bootstrap';
import { UserStorageService, UserStorage } from '../../services/UserStorage.service';
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
  llegoTarde: boolean | null = null;
  cumplioJornada: boolean | null = null;
  horaInicio1: string = '09:00';
  horaFin2: string = '17:00';
  horasTrabajadas: number = 0;
  tramos: { inicio: string; fin: string | null }[] = [];
  esPartida: boolean = false;
  isLoading: boolean = false;

  usercookie: UserStorage | null = null;

  constructor(
    private jornadaService: JornadaService,
    private UserStorageService: UserStorageService,
  ) { }


  ngOnInit(): void {
    this.actualizarReloj();
    setInterval(() => this.actualizarReloj(), 1000);
    this.cargarDatosJornada();
    this.usercookie = this.UserStorageService.getUser();
    console.log(this.UserStorageService.getUser());



    console.log(this.usercookie)
  }

  actualizarReloj(): void {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString();
    this.fechaActual = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private cargarDatosJornada(): void {
    this.isLoading = true;
    this.jornadaService.obtenerJornadaDeHoy().subscribe({
      next: (data) => {
        if (data?.tramos?.length) {
          this.tramos = data.tramos;
          const ultimo = this.tramos[this.tramos.length - 1];

          this.horaEntrada = new Date(this.tramos[0].inicio);
          this.horaSalida = ultimo.fin ? new Date(ultimo.fin) : null;
          this.duracion = `${data.horasTrabajadas}h`;
          this.horasTrabajadas = data.horasTrabajadas;
          this.cumplioJornada = data.completa;
          this.llegoTarde = new Date(this.tramos[0].inicio).getHours() > 9;
          this.esPartida = data.partida;
          this.jornadaIniciada = !ultimo.fin;
        } else {
          this.tramos = [];
          this.jornadaIniciada = false;
          this.horaEntrada = null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener jornada:', err);
        this.jornadaIniciada = false;
        this.horaEntrada = null;
        this.isLoading = false;
      }
    });
  }

  iniciarJornada(): void {
    this.isLoading = true;
    this.jornadaService.iniciarJornada().subscribe({
      next: () => this.cargarDatosJornada(),
      error: (err) => {
        console.error('Error al iniciar jornada:', err);
        this.isLoading = false;
      }
    });
  }

  terminarJornada(): void {
    this.isLoading = true;
    this.jornadaService.finalizarTramo().subscribe({
      next: () => this.cargarDatosJornada(),
      error: (err) => {
        console.error('Error al finalizar jornada:', err);
        this.isLoading = false;
      }
    });
  }

  calcularDuracionTramo(inicio: string, fin: string): string {
    const ini = new Date(inicio);
    const f = new Date(fin);
    const ms = f.getTime() - ini.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  openModal(): void {
    const modalEl = document.getElementById('detalleJornadaModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }
}
