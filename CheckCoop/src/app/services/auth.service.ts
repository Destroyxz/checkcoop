// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';

export interface User {
  sub: string;       // username or user id
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
  login(username: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>('http://localhost:3000', { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this._currentUser$.next(this.getUserFromToken()); 
        }),
        map(() => void 0)
      );
  }
  register(userData: { username: string; surname: string; email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:3000/auth/register', userData);
  }
  
  /** Elimina token y reinicia estado */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  /** Decodifica JWT y retorna el payload */
  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const obj = JSON.parse(decoded);
      return obj;
    } catch (e) {
      console.error('Token inválido', e);
      return null;
    }
  }
}
