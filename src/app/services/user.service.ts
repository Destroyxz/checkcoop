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

//Crear usuario
  newUser(data: NewUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/newUser`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Obtener todos los usuarios
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/users`)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Obtener los usuarios por empresa
  getUsersByCompany(empresa_id?: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/users/company/${empresa_id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar usuario
    deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/user/users/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  // Actualizar usuario
  update(u: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/usuarios/${u.id}`, u);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[UserService] Error:', error);
    return throwError(() => new Error('Error creando usuario'));
  }
}

