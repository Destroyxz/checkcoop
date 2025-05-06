import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;

    this.http.post('http://localhost:3000/auth/register', this.formData).subscribe({
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
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo completar el registro',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
