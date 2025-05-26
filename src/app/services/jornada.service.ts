import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JornadaService {
  private apiUrl = `http://localhost:3000/jornadas`;

  constructor(private http: HttpClient) { }

  // Encapsulamos opciones con headers y withCredentials
  private getOptions(): { headers: HttpHeaders; withCredentials: boolean } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      withCredentials: true
    };
  }

  iniciarJornada(): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, {}, this.getOptions());
  }

  finalizarTramo(): Observable<any> {
    return this.http.put(`${this.apiUrl}/finalizar`, {}, this.getOptions());
  }

  obtenerJornadaActiva(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activa`, this.getOptions());
  }

  obtenerJornadaDeHoy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hoy`, this.getOptions());
  }

  obtenerTodasLasJornadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`, this.getOptions());
  }

  obtenerTrabajadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, this.getOptions());
  }

  eliminarJornada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getOptions());
  }

  obtenerTramosPorJornada(jornadaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${jornadaId}/tramos`, this.getOptions());
  }

  actualizarTramos(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-tramos`, payload, this.getOptions());
  }
}
