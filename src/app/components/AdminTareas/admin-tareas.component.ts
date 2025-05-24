import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-tareas',
  templateUrl: './admin-tareas.component.html'
})
export class AdminTareasComponent implements OnInit {
  tareas: any[] = [];
  usuarios: any[] = [];

  tareaForm: any = {
    id: null,
    usuario_id: '',
    fecha: '',
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'pendiente'
  };

  modoEdicion: boolean = false;

  constructor(
    private tareaService: TareaService,
    private usuarioService: UserService,
      private authService: AuthService

  ) {}

  ngOnInit(): void {
    this.cargarTareas();
    this.cargarUsuarios();
  }

  cargarTareas(): void {
    this.tareaService.getTodas().subscribe({
      next: (data) => (this.tareas = data),
      error: (err) => console.error('Error cargando tareas:', err)
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getAllUsers().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

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
  estado: 'pendiente'
};
  }

  editarTarea(tarea: any): void {
    this.modoEdicion = true;
    this.tareaForm = { ...tarea };
  }

  guardarTarea(): void {
    if (this.modoEdicion) {
      this.tareaService.actualizar(this.tareaForm.id, this.tareaForm).subscribe(() => {
        this.cargarTareas();
      });
    } else {
      this.tareaService.crear(this.tareaForm).subscribe(() => {
        this.cargarTareas();
      });
    }
  }

  eliminarTarea(id: number): void {
    if (confirm('¿Eliminar esta tarea?')) {
      this.tareaService.eliminar(id).subscribe(() => this.cargarTareas());
    }
  }
} 