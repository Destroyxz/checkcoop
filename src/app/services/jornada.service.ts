//Importamos los módulos necesarios
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

  //Inicia una jornada
  iniciarJornada(): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, {}, this.getOptions());
  }

  //Finaliza un tramo de la jornada
  finalizarTramo(): Observable<any> {
    return this.http.put(`${this.apiUrl}/finalizar`, {}, this.getOptions());
  }

  //Obtiene la jornada activa 
  obtenerJornadaActiva(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activa`, this.getOptions());
  }

  //Obtiene la jornada de hoy 
  obtenerJornadaDeHoy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hoy`, this.getOptions());
  }

  //Obtiene todas las jornadas
  obtenerTodasLasJornadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`, this.getOptions());
  }

  //Elimina una jornada por ID
  eliminarJornada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getOptions());
  }

  //Obtiene los tramos de una jornada 
  obtenerTramosPorJornada(jornadaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${jornadaId}/tramos`, this.getOptions());
  }

  //Actualiza los tramos de una jornada
  actualizarTramos(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-tramos`, payload, this.getOptions());
  }
}
