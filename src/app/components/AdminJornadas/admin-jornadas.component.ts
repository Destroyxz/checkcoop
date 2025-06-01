//Importamos los componentes necesarios
import { Component, OnInit } from '@angular/core';
import { JornadaService } from '../../services/jornada.service';
import { Modal } from 'bootstrap';
import { UserService } from '../../services/user.service';
import { UserStorageService } from '../../services/UserStorage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-jornadas',
  templateUrl: './admin-jornadas.component.html',
})
export class AdminJornadasComponent implements OnInit {
  // Lista de todas las jornadas laborales
  jornadas: any[] = [];
  usuarios: any[] = [];

  // Lista de jornadas filtradas por trabajador o fecha
  jornadasFiltradas: any[] = [];

  // Lista de trabajadores disponibles para el filtro
  trabajadores: any[] = [];

  // Valores de los filtros
  filtroTrabajador: string = '';

  filtroFecha: string = '';

  // Jornada actualmente seleccionada
  jornadaSeleccionada: any = null;

  // Tramos de la jornada seleccionada (modo visualización)
  tramosSeleccionados: any[] = [];

  // Tramos en modo edición
  tramosEditables: any[] = [];

  // Bandera que indica si estamos en modo edición de tramos
  modoEdicionTramos: boolean = false;

  isSuperAdmin: boolean = false;

  constructor(
    private jornadaService: JornadaService,
    private userService: UserService,
    private userStorage: UserStorageService
  ) {}

  // Método que se ejecuta al cargar el componente

  ngOnInit(): void {
    const user = this.userStorage.getUser();
    this.isSuperAdmin = user?.rol === 'superadmin';

    this.cargarDatos();
    this.cargarUsuarios();
  }

  // Carga todas las jornadas y trabajadores desde el servidor
  cargarDatos(): void {
    this.jornadaService.obtenerTodasLasJornadas().subscribe((data) => {
      this.jornadas = data;

      this.filtrar();
    });

    if (this.isSuperAdmin) {
      this.userService.getAllUsers().subscribe((data) => {
        this.trabajadores = data;
      });
    } else {
      const empresaId = Number(localStorage.getItem('empresa_id'));
      this.userService.getUsersByCompany(empresaId).subscribe((data) => {
        this.trabajadores = data;
      });
    }
  }

  //Metodo que carga los usuarios
  cargarUsuarios(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error cargando usuarios:', err),
    });
  }

  // Filtra las jornadas según los criterios seleccionados
  filtrar(): void {
    this.jornadasFiltradas = this.jornadas.filter((j) => {
      const coincideTrabajador =
        this.filtroTrabajador === '' || j.usuario_id == this.filtroTrabajador;

      const coincideFecha =
        this.filtroFecha === '' ||
        new Date(j.fecha).toISOString().slice(0, 10) === this.filtroFecha;

      return coincideTrabajador && coincideFecha;
    });
  }

  // Visualiza los tramos de una jornada en un modal (modo solo lectura)
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

  // Activa el modo edición para los tramos de la jornada seleccionada
  activarEdicionTramos(): void {
    this.modoEdicionTramos = true;
    this.tramosEditables = this.tramosSeleccionados.map((t) => ({
      ...t,
      inicio: this.toDatetimeLocal(t.inicio),
      fin: t.fin ? this.toDatetimeLocal(t.fin) : null,
    }));
  }

  // Guarda los cambios realizados a los tramos y los envía al servidor
  guardarCambiosTramos(): void {
    if (!this.jornadaSeleccionada) return;

    const payload = {
      jornadaId: this.jornadaSeleccionada.id,
      tramos: this.tramosEditables,
    };

    this.jornadaService.actualizarTramos(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Hecho!',
          text: 'Tramos actualizados',
          confirmButtonText: 'Cerrar',
        });
        this.modoEdicionTramos = false;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al guardar cambios de tramos:', err);
      },
    });
  }

  // Elimina una jornada del sistema (tras confirmación)
  eliminarJornada(id: number): void {
    if (confirm('¿Eliminar esta jornada?')) {
      this.jornadaService.eliminarJornada(id).subscribe(() => {
        this.cargarDatos();
      });
    }
  }

  // Abre el modal de edición para modificar los tramos de una jornada
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

  // Calcula la duración entre dos horarios y la devuelve como texto legible
  calcularDuracionTramo(inicio: string, fin: string): string {
    const ini = new Date(inicio);
    const f = new Date(fin);
    const ms = f.getTime() - ini.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  // Convierte una fecha a formato local compatible con inputs de tipo datetime-local
  toDatetimeLocal(dateStr: string): string {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  // Muestra un modal de Bootstrap utilizando su ID
  private mostrarModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  // Agrega un nuevo tramo editable con hora actual y sin hora de fin
  agregarTramo(): void {
    this.tramosEditables.push({
      inicio: this.toDatetimeLocal(new Date().toISOString()),
      fin: null,
    });
  }

  // Elimina un tramo editable según su índice
  eliminarTramo(index: number): void {
    this.tramosEditables.splice(index, 1);
  }

  // Formatea minutos totales como texto legible (ej. "1h 30min")
  formatearMinutosComoTexto(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    let resultado = '';

    if (h > 0) resultado += `${h}h`;
    if (m > 0) resultado += (h > 0 ? ' ' : '') + `${m}min`;
    if (resultado === '') resultado = '0min';

    return resultado;
  }
}
