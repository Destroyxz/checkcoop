import { Component, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { UserStorageService, UserStorage } from '../../services/UserStorage.service';

@Component({
  selector: 'app-tareas-usuario',
  templateUrl: './tareas-usuario.component.html',
})
export class TareasUsuarioComponent implements OnInit {
  tareas: any[] = [];
  usercookie: UserStorage | null = null;

  constructor(
    private tareaService: TareaService,
    private userStorageService: UserStorageService
  ) { }

  ngOnInit(): void {
    this.usercookie = this.userStorageService.getUser();

    if (this.usercookie && this.usercookie.id) {
      this.tareaService.getPorUsuario(this.usercookie.id).subscribe({
        next: (data) => {
          this.tareas = data;
        },
        error: (err) => console.error('Error al cargar tareas del usuario', err)
      });
    } else {
      console.error('Usuario no autenticado o ID inválido');
    }
  }

  esPendiente(tarea: any): boolean {
    return tarea.estado === 'pendiente' || tarea.estado === 'en progreso';
  }
}
