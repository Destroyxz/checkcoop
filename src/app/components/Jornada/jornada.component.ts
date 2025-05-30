//Importamos los componentes necesarios
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
 horaInicio1: string = '';
horaFin1: string = '';
horaInicio2: string = '';
horaFin2: string = '';
jornadaPartida: boolean = false;

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

  //Funcion para actualizar el reloj que se muestra al usuario
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

  //Funcion que carga todos los datos referentes a la jornada de hoy
private cargarDatosJornada(): void {
  this.isLoading = true;
  this.jornadaService.obtenerJornadaDeHoy().subscribe({
    next: (data) => {
      // Siempre asignar horarios esperados
      this.horaInicio1 = data.hora_inicio_1;
      this.horaFin1 = data.hora_fin_1;
      this.horaInicio2 = data.hora_inicio_2;
      this.horaFin2 = data.hora_fin_2;
      this.jornadaPartida = data.jornadaPartida;
console.log('Horario previsto:', this.horaInicio1, this.horaFin1, this.horaInicio2, this.horaFin2, this.jornadaPartida);

      if (data?.tramos?.length) {
        this.tramos = data.tramos;
        const ultimo = this.tramos[this.tramos.length - 1];

        this.horaEntrada = new Date(this.tramos[0].inicio);

        if (ultimo.fin) {
          this.horaSalida = new Date(ultimo.fin);
          this.duracion = this.calcularDuracionTramo(this.tramos[0].inicio, ultimo.fin);
        } else {
          this.horaSalida = null;
          const ahora = new Date().toISOString();
          this.duracion = this.calcularDuracionTramo(this.tramos[0].inicio, ahora);
        }

        this.horasTrabajadas = data.horasTrabajadas;
        this.cumplioJornada = data.completa;
        this.llegoTarde = data.llegoTarde;
        this.esPartida = data.partida;
        this.jornadaIniciada = !ultimo.fin;
      } else {
        this.tramos = [];
        this.jornadaIniciada = false;
        this.horaEntrada = null;
        this.horaSalida = null;
        this.duracion = '';
        this.horasTrabajadas = 0;
        this.cumplioJornada = null;
        this.llegoTarde = null;
        this.esPartida = false;
      }

      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error al obtener jornada:', err);
      this.jornadaIniciada = false;
      this.horaEntrada = null;
      this.horaSalida = null;
      this.duracion = '';
      this.isLoading = false;
    }
  });
}


  //Funcion que permite iniciar/reanudar la jornada
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

  //Funcion para finalizar la jornada/tramo
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

  //Funcion para calcular el tiempo que estuvo iniciado el tramo
  calcularDuracionTramo(inicio: string, fin: string): string {
    const ini = new Date(inicio);
    const f = new Date(fin);
    const ms = f.getTime() - ini.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  //Modal que permite ver detalles de la jornada
  openModal(): void {
    const modalEl = document.getElementById('detalleJornadaModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }
}
