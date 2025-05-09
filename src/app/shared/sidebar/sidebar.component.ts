import { Component, EventEmitter, Input, Output } from '@angular/core';

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

export class SidebarComponent {
  /** Recibe y emite el estado de expansión para two-way binding */
  @Input()  expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [
    { label: 'Inicio',      path: '/dashboard', icon: 'fas fa-home'       },
    { label: 'Fichar',     path: '/jornada',   icon: 'fas fa-th-large'  },
    { label: 'Facturación', path: '/invoicing', icon: 'fas fa-receipt'   },
    { label: 'Archivos',    path: '/files',     icon: 'fas fa-folder'    },
    { label: 'Chat',        path: '/chat',      icon: 'fas fa-comments'  },
    // …añade los que necesites
  ];

  /** Alterna al hacer clic en el botón */
  toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }

  /** Expande al pasar el ratón */
  onMouseEnter(): void {
    this.expanded = true;
    this.expandedChange.emit(true);
  }

  /** Contrae al salir el ratón */
  onMouseLeave(): void {
    this.expanded = false;
    this.expandedChange.emit(false);
  }
}
