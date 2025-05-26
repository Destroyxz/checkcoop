import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  expanded = false;

  constructor(
    private authService: AuthService,
    public router: Router
  ) { }

  onLogout(): void {
    this.authService.logout();
  }

  // ✅ Devuelve true si NO estás en login o register
  shouldShowLayout(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }
}
