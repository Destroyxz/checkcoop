// login.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';

import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.loading = true;
    console.log(this.username, ' ',this.password)
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;

        // Obtenemos el user decodificado suscribiéndonos una sola vez
        this.auth.currentUser$.pipe(take(1)).subscribe((user: User | null) => {

          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Hola Peter, has iniciado sesión correctamente.`,
            timer: 2000,
            showConfirmButton: false
          });

          // aquí podrías redirigir, ej:
          // this.router.navigate(['/dashboard']);
        });
      },
      error: err => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text:
            err.status === 401
              ? 'Usuario o contraseña incorrectos.'
              : 'Ha ocurrido un error, inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
