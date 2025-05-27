import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricasService {
  private apiUrl = `http://localhost:3000/metricas`;

  constructor(private http: HttpClient) {}

  private getOptions(params?: HttpParams): { headers: HttpHeaders; withCredentials: boolean; params?: HttpParams } {
    const token = localStorage.getItem('token');
    const options: { headers: HttpHeaders; withCredentials: boolean; params?: HttpParams } = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      withCredentials: true
    };
    if (params) options.params = params;
    return options;
  }

  // --- Usuarios ---

  getTotalUsers(empresaId: string): Observable<{ total_users: number }> {
    const params = new HttpParams().set('empresa_id', empresaId);
    return this.http.get<{ total_users: number }>(`${this.apiUrl}/users/total`, this.getOptions(params));
  }

  getActiveUsers(empresaId: string, from: string, to: string): Observable<{ active_users: number }> {
    let params = new HttpParams()
      .set('empresa_id', empresaId)
      .set('from', from)
      .set('to', to);
    return this.http.get<{ active_users: number }>(`${this.apiUrl}/users/active`, this.getOptions(params));
  }

  getNewUsers(
    empresaId: string,
    from: string,
    to: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Observable<Array<{ period: string; new_users: number }>> {
    let params = new HttpParams()
      .set('empresa_id', empresaId)
      .set('from', from)
      .set('to', to)
      .set('group_by', groupBy);
    return this.http.get<Array<{ period: string; new_users: number }>>(
      `${this.apiUrl}/users/new`,
      this.getOptions(params)
    );
  }

  getLastLogin(
    empresaId: string,
    from: string,
    to: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Observable<Array<{ period: string; logins: number }>> {
    let params = new HttpParams()
      .set('empresa_id', empresaId)
      .set('from', from)
      .set('to', to)
      .set('group_by', groupBy);
    return this.http.get<Array<{ period: string; logins: number }>>(
      `${this.apiUrl}/users/last-login`,
      this.getOptions(params)
    );
  }

  // --- Empresas ---

  getTotalCompanies(): Observable<{ total_companies: number }> {
    return this.http.get<{ total_companies: number }>(
      `${this.apiUrl}/companies/total`,
      this.getOptions()
    );
  }

  getNewCompanies(
    from: string,
    to: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Observable<Array<{ period: string; new_companies: number }>> {
    let params = new HttpParams().set('from', from).set('to', to).set('group_by', groupBy);
    return this.http.get<Array<{ period: string; new_companies: number }>>(
      `${this.apiUrl}/companies/new`,
      this.getOptions(params)
    );
  }

  // --- Jornadas ---

  getAverageDuration(empresaId: string, from: string, to: string): Observable<{ average_duration: number }> {
    let params = new HttpParams().set('empresa_id', empresaId).set('from', from).set('to', to);
    return this.http.get<{ average_duration: number }>(
      `${this.apiUrl}/jornadas/average-duration`,
      this.getOptions(params)
    );
  }

  getLateRate(
    empresaId: string,
    from: string,
    to: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Observable<Array<{ period: string; late_rate: number }>> {
    let params = new HttpParams()
      .set('empresa_id', empresaId)
      .set('from', from)
      .set('to', to)
      .set('group_by', groupBy);
    return this.http.get<Array<{ period: string; late_rate: number }>>(
      `${this.apiUrl}/jornadas/late-rate`,
      this.getOptions(params)
    );
  }

  getComplianceRate(
    empresaId: string,
    from: string,
    to: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Observable<Array<{ period: string; compliance_rate: number }>> {
    let params = new HttpParams()
      .set('empresa_id', empresaId)
      .set('from', from)
      .set('to', to)
      .set('group_by', groupBy);
    return this.http.get<Array<{ period: string; compliance_rate: number }>>(
      `${this.apiUrl}/jornadas/compliance-rate`,
      this.getOptions(params)
    );
  }

  getTotalMinutes(
    empresaId: string,
    from: string,
    to: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Observable<Array<{ period: string; total_minutes: number }>> {
    let params = new HttpParams()
      .set('empresa_id', empresaId)
      .set('from', from)
      .set('to', to)
      .set('group_by', groupBy);
    return this.http.get<Array<{ period: string; total_minutes: number }>>(
      `${this.apiUrl}/jornadas/total-minutes`,
      this.getOptions(params)
    );
  }

  getAverageTramosCount(empresaId: string, from: string, to: string): Observable<{ average_count: number }> {
    let params = new HttpParams().set('empresa_id', empresaId).set('from', from).set('to', to);
    return this.http.get<{ average_count: number }>(
      `${this.apiUrl}/jornadas/tramos/average-count`,
      this.getOptions(params)
    );
  }

  getDurationDistribution(
    empresaId: string,
    from: string,
    to: string
  ): Observable<Array<{ bucket: number; count: number }>> {
    let params = new HttpParams().set('empresa_id', empresaId).set('from', from).set('to', to);
    return this.http.get<Array<{ bucket: number; count: number }>>(
      `${this.apiUrl}/jornadas/tramos/duration-distribution`,
      this.getOptions(params)
    );
  }

  // --- Productos ---

  getStockLevels(empresaId: string): Observable<Array<{ id: number; nombre: string; cantidad: number; unidad: string }>> {
    const params = new HttpParams().set('empresa_id', empresaId);
    return this.http.get<Array<{ id: number; nombre: string; cantidad: number; unidad: string }>>(
      `${this.apiUrl}/products/stock-levels`,
      this.getOptions(params)
    );
  }

  getTotalStockValue(empresaId: string): Observable<{ inventory_value: number }> {
    const params = new HttpParams().set('empresa_id', empresaId);
    return this.http.get<{ inventory_value: number }>(
      `${this.apiUrl}/products/total-stock-value`,
      this.getOptions(params)
    );
  }

  getProductsByCategory(
    empresaId: string
  ): Observable<Array<{ categoria: string; total_quantity: number; total_value: number }>> {
    const params = new HttpParams().set('empresa_id', empresaId);
    return this.http.get<Array<{ categoria: string; total_quantity: number; total_value: number }>>(
      `${this.apiUrl}/products/by-category`,
      this.getOptions(params)
    );
  }
}