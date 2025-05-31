//Importamos los módulos necesarios
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';

export interface User {
  sub: string;
  iat: number;
  rol: string;
  exp: number;
  empresa_id: number;
  nombre: string;
  apellidos: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'ERP_TOKEN';
  private _currentUser$ = new BehaviorSubject<User | null>(this.getUserFromToken());
  public currentUser$ = this._currentUser$.asObservable();
  public isLogged$ = this._currentUser$.pipe(
    map(user => !!user && user.exp * 1000 > Date.now())
  );

  // Acceso al token actual
  public get token(): string | null {
    return this.getToken();
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  //Metodo que devuelve el token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  //Comprueba si esta autenticado
  isAuthenticated(): boolean {
    const user = this.getUserFromToken();
    return !!user && user.exp * 1000 > Date.now();
  }

  //Se logea si todo es valido
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

  //Registra un nuevo usuario
  register(userData: { username: string; surname: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData);
  }

  //Elimina token y reinicia estado
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  //Decodifica JWT y retorna el payload
  private getUserFromToken(): User | null {
    let token = this.getToken();

    // Si no existe un token, generamos uno de prueba
    if (!token) {
      console.log('No se encontró el token en localStorage. Generando un token de prueba.');
      token = this.generateFakeToken();
      localStorage.setItem(this.tokenKey, token);
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

  //Metodo que genera un token falso para pruebas
  private generateFakeToken(): string {
    const payload = {
      sub: 'testUser',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      name: 'Test User'
    };


    const base64Url = this.base64UrlEncode(JSON.stringify(payload));
    const signature = 'dummy_signature';
    return `header.${base64Url}.${signature}`;
  }

  //Metodo que convierte un string a base64Url
  private base64UrlEncode(str: string): string {
    const base64 = btoa(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  //Devuelve el usuario actual decodificado del token
  getUser(): User | null {
    return this._currentUser$.value;
  }

}
