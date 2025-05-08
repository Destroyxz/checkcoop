import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;

        this.auth.currentUser$.pipe(take(1)).subscribe((user: User | null) => {
          const name = user?.["name"] || this.email;

          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Hola ${name}, has iniciado sesión correctamente.`,
            timer: 2000,
            showConfirmButton: false
          });

          this.router.navigate(['/dashboard']); // ✅ Redirección activa
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
