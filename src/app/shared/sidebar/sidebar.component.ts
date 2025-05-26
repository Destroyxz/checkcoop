import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
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

    this.menuItems = [
      { label: 'Inicio', path: '/dashboard', icon: 'fas fa-home' },
      { label: 'Jornadas', path: esAdmin ? '/adminjornadas' : '/jornada', icon: 'fas fa-clock' },
      { label: 'Tareas', path: esAdmin ? '/admintareas' : '/tareas', icon: 'fas fa-tasks' },
      { label: 'Añadir', path: '/new', icon: 'fas fa-user' }
    ];

    if (esAdmin) {
      this.menuItems.splice(2, 0, { label: 'Inventario', path: '/inventario', icon: 'fas fa-receipt' });
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
