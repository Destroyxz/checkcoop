// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';

export interface User {
  sub: string;       //ID de Usuario
  iat: number;
  exp: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'ERP_TOKEN';
  private _currentUser$ = new BehaviorSubject<User | null>(this.getUserFromToken());
  public currentUser$ = this._currentUser$.asObservable();
  public isLogged$ = this._currentUser$.pipe(
    map(user => !!user && user.exp * 1000 > Date.now())
  );

  public get token(): string | null {
    return this.getToken();
  }
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /** Devuelve el token almacenado o null */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Comprueba si hay token y no está expirado */
  isAuthenticated(): boolean {
    const user = this.getUserFromToken();
    return !!user && user.exp * 1000 > Date.now();
  }

  /** Envía credenciales y almacena token si es válido */
  login(email: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, {
      email: email,
      password
    })
    
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this._currentUser$.next(this.getUserFromToken()); 
        }),
        map(() => void 0)
      );
  }
  register(userData: { username: string; surname: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData);
  }
  
  /** Elimina token y reinicia estado */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  /** Decodifica JWT y retorna el payload */
  private getUserFromToken(): User | null {
    let token = this.getToken();
  
    // Si no existe un token, generamos uno de prueba
    if (!token) {
      console.log('No se encontró el token en localStorage. Generando un token de prueba.');
      token = this.generateFakeToken(); // Generamos un token de prueba
      localStorage.setItem(this.tokenKey, token); // Guardamos el token en localStorage
    }
  
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Token JWT inválido. No tiene la estructura esperada.');
        return null;
      }
  
      const payload = tokenParts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const obj = JSON.parse(decoded);
      return obj;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  /** Genera un token falso (solo para pruebas) */
private generateFakeToken(): string {
  const payload = {
    sub: 'testUser',
    iat: Math.floor(Date.now() / 1000),  // Timestamp actual
    exp: Math.floor(Date.now() / 1000) + (60 * 60),  // 1 hora de expiración
    name: 'Test User'
  };
  
  // Generamos un JWT simple con el payload
  const base64Url = this.base64UrlEncode(JSON.stringify(payload));
  const signature = 'dummy_signature';  // Esta es una firma dummy solo para pruebas
  return `header.${base64Url}.${signature}`;
}

/** Codifica el payload en base64Url */
private base64UrlEncode(str: string): string {
  const base64 = btoa(str); // Convierte a base64
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');  // Convierte a base64Url
}
}
