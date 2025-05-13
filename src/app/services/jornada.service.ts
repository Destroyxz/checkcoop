

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JornadaService {
  private apiUrl = `http://localhost:3000/jornadas`;

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

  obtenerTodasLasJornadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }

  obtenerTrabajadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  eliminarJornada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerTramosPorJornada(jornadaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${jornadaId}/tramos`);
  }
}
