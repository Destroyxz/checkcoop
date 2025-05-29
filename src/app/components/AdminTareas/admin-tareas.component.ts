// Importamos los servicios necesarios
import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-tareas',
  templateUrl: './admin-tareas.component.html',
})
export class AdminTareasComponent implements OnInit {
  // Lista de tareas y usuarios
  tareas: any[] = [];
  usuarios: any[] = [];

  // Modelo del formulario de tarea
  tareaForm: any = {
    id: null,
    usuario_id: '',
    fecha: '',
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'pendiente',
  };

  //Para activar o no diferentes cosas dependiendo de su modoEdicion
  modoEdicion: boolean = false;

  // Filtros
  filtroBusqueda: string = '';
  filtroTrabajador: string = '';
  filtroFecha: string = '';

  // Tareas filtradas que se muestran en la tabla
  tareasFiltradas: any[] = [];

  constructor(
    private tareaService: TareaService,
    private usuarioService: UserService,
    private authService: AuthService
  ) { }

  // Se ejecuta al cargar el componente
  ngOnInit(): void {
    this.cargarTareas();
    this.cargarUsuarios();
  }

  // Carga todas las tareas
  cargarTareas(): void {
    this.tareaService.getTodas().subscribe({
      next: (data) => {
        this.tareas = data;
        this.filtrar(); // aplica filtros automáticamente
      },
      error: (err) => console.error('Error cargando tareas:', err),
    });
  }

  // Carga los usuarios para asignar tareas
  cargarUsuarios(): void {
    this.usuarioService.getAllUsers().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error cargando usuarios:', err),
    });
  }

  // Abre el modal para crear nueva tarea
  abrirNuevaTarea(): void {
    const usuario = this.authService.getUser();
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    this.modoEdicion = false;
    this.tareaForm = {
      id: null,
      usuario_id: '',
      empresa_id: usuario?.empresa_id || null,
      fecha: fechaActual,
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      estado: 'pendiente',
    };
  }
  //Permite editar los valores de la tarea
  editarTarea(tarea: any): void {
    this.modoEdicion = true;
    this.tareaForm = { ...tarea };
  }

  //Guarda la tarea nueva o la que se edita
  guardarTarea(): void {
    if (this.modoEdicion) {
      this.tareaService
        .actualizar(this.tareaForm.id, this.tareaForm)
        .subscribe(() => {
          this.cargarTareas();
        });
    } else {
      this.tareaService.crear(this.tareaForm).subscribe(() => {
        this.cargarTareas();
      });
    }
  }

  //Elimina la tarea si confirmas 
  eliminarTarea(id: number): void {
    if (confirm('¿Eliminar esta tarea?')) {
      this.tareaService.eliminar(id).subscribe(() => this.cargarTareas());
    }
  }
  // Filtra tareas según búsqueda y trabajador
  filtrar(): void {
    this.tareasFiltradas = this.tareas.filter((t) => {
      const coincideBusqueda =
        this.filtroBusqueda === '' ||
        t.titulo.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      const coincideTrabajador =
        this.filtroTrabajador === '' || t.usuario_id == this.filtroTrabajador;

      return coincideBusqueda && coincideTrabajador;
    });
  }
}
