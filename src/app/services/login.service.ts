import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

export interface UserPayload {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
}

export interface AuthResult {
  token: string;
  user: UserPayload;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl; // Ajusta según tu entorno

  constructor(private http: HttpClient) { }

  /**
   * Envía credenciales al backend y guarda token + usuario en localStorage
   */
  login(email: string, password: string): Observable<AuthResult> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post<AuthResult>(url, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  /**
   * Elimina credenciales del almacenamiento
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Comprueba si el usuario está autenticado
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Devuelve información del usuario guardado
   */
  getUser(): UserPayload | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) as UserPayload : null;
  }
}
