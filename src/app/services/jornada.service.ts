// src/app/services/jornada.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JornadaService {
  private apiUrl = 'http://localhost:3000/jornadas';

  constructor(private http: HttpClient) {}

  iniciarJornada(): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, {});
  }

  finalizarTramo(): Observable<any> {
    return this.http.put(`${this.apiUrl}/finalizar`, {});
  }

  obtenerJornadaActiva(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activa`);
  }

  obtenerJornadaDeHoy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hoy`);
  }
}
