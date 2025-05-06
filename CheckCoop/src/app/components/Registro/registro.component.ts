import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  formData = {
    username: '',
    surname: '',
    email: '',
    password: ''
  };

  loading = false;

  constructor(private auth: AuthService) {} // ← también corriges aquí

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;

    this.auth.register(this.formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'Ahora puedes iniciar sesión',
          timer: 2000,
          showConfirmButton: false
        });
        form.resetForm();
        // this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text:
            err.status === 409
              ? 'Este correo o usuario ya está registrado.'
              : 'No se pudo completar el registro. Inténtalo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
