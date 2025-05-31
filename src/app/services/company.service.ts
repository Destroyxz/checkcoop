//Importamos los módulos necesarios
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }



  //Crear empresa
  newCompany(data: Partial<Company>): Observable<Company> {
    return this.http
      .post<Company>(`${this.baseUrl}/company/newCompany`, data)
      .pipe(catchError(this.handleError));
  }
  //Obtiene todas las empresas
  getAllEmpresas(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/company/empresas`)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Obtiene una empresa por ID
  getEmpresaById(empresa_id?: number): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/company/empresas/${empresa_id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar empresa
  deleteEmpresa(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  // Actualizar empresa
  update(e: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/company/empresas/${e.id}`, e);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[CompanyService] Error fetching companies:', error);
    return throwError(() => new Error('No se pudieron cargar las empresas.'));
  }
}
