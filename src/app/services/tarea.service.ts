import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private API_URL = 'http://localhost:3000/api/tareas';

  constructor(private http: HttpClient) { }

  getTodas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`);
  }

  getPorUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/usuario/${userId}`);
  }

  crear(tarea: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, tarea);
  }

  actualizar(id: number, tarea: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, tarea);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
