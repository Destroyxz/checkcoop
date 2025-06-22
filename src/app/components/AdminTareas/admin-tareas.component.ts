// Importamos los servicios necesarios
import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserStorageService } from '../../services/UserStorage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-tareas',
  templateUrl: './admin-tareas.component.html',
  styleUrls: ['./admin-tareas.component.scss'],
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
  isSuperAdmin: boolean = false;

  // Tareas filtradas que se muestran en la tabla
  tareasFiltradas: any[] = [];

  constructor(
    private tareaService: TareaService,
    private usuarioService: UserService,
    private authService: AuthService,
    private userStorage: UserStorageService
  ) {}

  // Se ejecuta al cargar el componente
  ngOnInit(): void {
    const user = this.userStorage.getUser();
    this.isSuperAdmin = user?.rol === 'superadmin';
    this.cargarTareas();
    this.cargarUsuarios(user);
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
  cargarUsuarios(user: any): void {
    this.usuarioService.getUsersByCompany(user.empresa_id).subscribe({
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
    Swal.fire({
      title: '¿Eliminar esta tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      // Si el usuario confirma, llamamos al servicio
      this.tareaService.eliminar(id).subscribe(() => {
        this.cargarTareas();
        // Opcional: mostrar un breve mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Tarea eliminada',
          showConfirmButton: false,
          timer: 1200,
        });
      });
    });
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
