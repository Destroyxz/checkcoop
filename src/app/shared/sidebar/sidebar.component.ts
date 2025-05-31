import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getUser();
    const esAdmin = user && (user.rol === 'admin' || user.rol === 'superadmin');

// En tu componente TS:
this.menuItems = [
  { 
    label: 'Inicio', 
    path: '/home', 
    icon: 'fas fa-home', 
    ariaLabel: 'Ir a Inicio' 
  },
  { 
    label: 'Jornadas',
    path: esAdmin ? '/adminjornadas' : '/jornada',
    icon: 'fas fa-clock',
    ariaLabel: esAdmin ? 'Ir a gestión de Jornadas (administrador)' : 'Ir a Jornadas'
  },
  { 
    label: 'Tareas',
    path: esAdmin ? '/admintareas' : '/tareas',
    icon: 'fas fa-tasks',
    ariaLabel: esAdmin ? 'Ir a gestión de Tareas (administrador)' : 'Ir a Tareas'
  },
  { 
    label: 'Añadir',
    path: '/new',
    icon: 'fas fa-user',
    ariaLabel: 'Crear nuevo usuario'
  }
];


    if (esAdmin) {
      this.menuItems.splice(2, 0, { label: 'Inventario', path: '/inventario', icon: 'fas fa-receipt', ariaLabel: 'Ir a Inventario' });
    }

  }
  toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }

  onMouseEnter(): void {
    this.expanded = true;
    this.expandedChange.emit(true);
  }

  onMouseLeave(): void {
    this.expanded = false;
    this.expandedChange.emit(false);
  }
}
