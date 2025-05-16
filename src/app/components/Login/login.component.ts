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
  
    console.log('Iniciando sesión con email:', this.email);  // Log para ver el email con el que se intenta hacer login
  
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        console.log('Login exitoso');  // Log para confirmar que el login fue exitoso
    
        // Después de que el login es exitoso, el token debería estar en localStorage.
        const token = localStorage.getItem('ERP_TOKEN');
        if (!token) {
          console.error('No se recibió el token después del login.');
          return;
        }
    
        // El token se guarda en el servicio de autenticación y se actualiza el estado del usuario.
this.auth.currentUser$.pipe(take(1)).subscribe((user: User | null) => {
  console.log('Usuario recuperado:', user);  // Log para ver el usuario recuperado

  // Si no hay usuario en el payload, se asume que el email es el nombre
  const name = user?.["name"] || this.email;

  // Guardar los datos del usuario en el localStorage
  if (user) {
    localStorage.setItem('user', JSON.stringify({
    id: user?.["id"],
    empresa_id: user?.["empresa_id"],
    exp_Token: user?.["exp"],  // si quieres guardar fecha de expiración del token
    nombre: user?.["nombre"],
    apellidos: user?.["apellidos"],
    email: user?.["email"],
    rol: user?.["rol"],
  }));

  }

  // Mostrar un mensaje de bienvenida usando Swal
  Swal.fire({
    icon: 'success',
    title: '¡Bienvenido!',
    text: `Hola ${name}, has iniciado sesión correctamente.`,
    timer: 2000,
    showConfirmButton: false
  });

  // Redirigir al dashboard una vez autenticado
  this.router.navigate(['/dashboard']);
});


      },
      error: err => {
        this.loading = false;
        console.error('Error en el login:', err);  // Log para mostrar el error completo
    
        // Mostrar mensaje de error según el código de estado
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
