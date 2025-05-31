//Importamos los componentes que usaremos 
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Controla si el sidebar está expandido o colapsado
  expanded = false;

  constructor(
    private authService: AuthService,
    public router: Router
  ) { }

  // Cierra la sesión del usuario y limpia los datos
  onLogout(): void {
    this.authService.logout();
  }

  // Devuelve true si no estas en el login o en el registro, para ocultar el sidebar y header en el login x ejemplo
  shouldShowLayout(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }
}
