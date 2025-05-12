// src/app/services/jornada.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JornadaService {
  private apiUrl = 'http://localhost:3000/jornadas'; // Asegúrate de que coincide con tu backend

  constructor(private http: HttpClient) {}

  guardarJornada(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
