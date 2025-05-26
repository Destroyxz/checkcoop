import { Component, OnInit } from '@angular/core';
import { JornadaService } from '../../services/jornada.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-admin-jornadas',
  templateUrl: './admin-jornadas.component.html',
})
export class AdminJornadasComponent implements OnInit {
  jornadas: any[] = [];
  jornadasFiltradas: any[] = [];
  trabajadores: any[] = [];

  filtroTrabajador: string = '';
  filtroFecha: string = '';

  jornadaSeleccionada: any = null;
  tramosSeleccionados: any[] = [];
  tramosEditables: any[] = [];

  modoEdicionTramos: boolean = false;

  constructor(private jornadaService: JornadaService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.jornadaService.obtenerTodasLasJornadas().subscribe((data) => {
      this.jornadas = data;
      this.jornadasFiltradas = [...data];
    });

    this.jornadaService.obtenerTrabajadores().subscribe((data) => {
      this.trabajadores = data;
    });
  }

  filtrar(): void {
    this.jornadasFiltradas = this.jornadas.filter((j) => {
      const coincideTrabajador = this.filtroTrabajador
        ? j.usuario_id == this.filtroTrabajador
        : true;
      const coincideFecha = this.filtroFecha
        ? j.fecha === this.filtroFecha
        : true;
      return coincideTrabajador && coincideFecha;
    });
  }

  verTramos(jornada: any): void {
    this.jornadaSeleccionada = jornada;
    this.modoEdicionTramos = false;

    this.jornadaService.obtenerTramosPorJornada(jornada.id).subscribe({
      next: (data) => {
        this.tramosSeleccionados = data;
        this.mostrarModal('modalDetalleJornada');
      },
      error: (err) => {
        console.error('Error al cargar tramos:', err);
      },
    });
  }

  activarEdicionTramos(): void {
    this.modoEdicionTramos = true;
    this.tramosEditables = this.tramosSeleccionados.map((t) => ({
      ...t,
      inicio: this.toDatetimeLocal(t.inicio),
      fin: t.fin ? this.toDatetimeLocal(t.fin) : null,
    }));
  }

  guardarCambiosTramos(): void {
    if (!this.jornadaSeleccionada) return;

    const payload = {
      jornadaId: this.jornadaSeleccionada.id,
      tramos: this.tramosEditables,
    };

    this.jornadaService.actualizarTramos(payload).subscribe({
      next: () => {
        alert('Tramos actualizados');
        this.modoEdicionTramos = false;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al guardar cambios de tramos:', err);
      },
    });
  }

  eliminarJornada(id: number): void {
    if (confirm('¿Eliminar esta jornada?')) {
      this.jornadaService.eliminarJornada(id).subscribe(() => {
        this.cargarDatos();
      });
    }
  }

  editarJornada(jornada: any): void {
    this.jornadaSeleccionada = jornada;

    this.jornadaService.obtenerTramosPorJornada(jornada.id).subscribe({
      next: (data) => {
        this.tramosEditables = data.map((t) => ({
          ...t,
          inicio: this.toDatetimeLocal(t.inicio),
          fin: t.fin ? this.toDatetimeLocal(t.fin) : null,
        }));

        this.mostrarModal('modalEditarJornada');
      },
      error: (err) => {
        console.error('Error al cargar tramos para edición:', err);
      },
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

  toDatetimeLocal(dateStr: string): string {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  private mostrarModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }
  agregarTramo(): void {
    this.tramosEditables.push({
      inicio: this.toDatetimeLocal(new Date().toISOString()),
      fin: null,
    });
  }

  eliminarTramo(index: number): void {
    this.tramosEditables.splice(index, 1);
  }
}
