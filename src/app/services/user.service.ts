import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
export interface NewUser {
  nombre: string;
  apellidos?: string;
  email: string;
  telefono: string;
  rol: 'superadmin' | 'admin' | 'usuario';
  empresa_id: number;
  password: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo usuario en el backend
   */
  newUser(data: NewUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/newUser`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[UserService] Error:', error);
    return throwError(() => new Error('Error creando usuario'));
  }
}

// Ejemplo de suscripción en tu componente:
// this.userService.newUser(nuevoUsuario).subscribe({
//   next: (res) => {
//     console.log('Usuario creado:', res);
//     this.form.reset({ activo: true, rol: 'usuario' });
//   },
//   error: (err) => console.error('Error al crear usuario', err),
//   complete: () => console.log('Creación completada')
// });
