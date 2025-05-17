

import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';


export interface Company {
  id: number;
  nombre: string;
  razon_social: string;
  nif_cif: string;
  direccion: string;
  email_contacto: string;
  telefono: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })

export class CompanyService {

   private baseUrl = environment.apiUrl; // Ajusta según tu entorno

    constructor (
        private http: HttpClient
    ) {

    }
   //Obtiene todas las empresas

getAllCompanies(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/company/allcompanies`)
      .pipe(
        catchError(this.handleError)
      );
  }

newCompany(data: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/company/newCompany`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[CompanyService] Error fetching companies:', error);
    // Aquí podrías mapear distintos códigos de status a mensajes amigables
    return throwError(() => new Error('No se pudieron cargar las empresas.'));
  }

}