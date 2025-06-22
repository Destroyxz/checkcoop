import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('ERP_TOKEN');
    const user  = localStorage.getItem('user');

    if (token && user) {
      // Tiene ambos → permitimos acceso
      return true;
    }

    // Falta token o user → redirigimos primero...
    this.router.navigate(['/login']).then(() => {
      // ...y al completarse la navegación mostramos la alerta
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'No tienes permisos para entrar en esta sección.',
        confirmButtonText: 'Ok'
      });
    });

    return false;
  }
}
