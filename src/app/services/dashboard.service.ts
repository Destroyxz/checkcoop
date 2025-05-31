import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class dashboardService {
  private baseUrl = `http://localhost:3000/dashboard`;

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


  /**
 * 1) Total de usuarios registrados.
 *    GET /dashboard/usuarios/total
 */
  getTotalUsuarios(): Observable<{ totalUsuarios: number }> {
    const url = `${this.baseUrl}/usuarios/total`;
    return this.http.get<{ totalUsuarios: number }>(url, this.getOptions());
  }

  /**
   * 2) Total de usuarios registrados en una empresa específica.
   *    GET /dashboard/usuarios/total/:empresa_id
   */
  getTotalUsuariosPorEmpresa(empresaId: number): Observable<{ empresa_id: number; totalUsuarios: number }> {
    const url = `${this.baseUrl}/usuarios/total/${empresaId}`;
    return this.http.get<{ empresa_id: number; totalUsuarios: number }>(url, this.getOptions());
  }

  /**
   * 3) Usuarios totales por día (toda la base).
   *    GET /dashboard/usuarios/por-dia
   */
  getUsuariosPorDia(): Observable<Array<{ fecha: string; cantidad: number }>> {
    const url = `${this.baseUrl}/usuarios/por-dia`;
    return this.http.get<Array<{ fecha: string; cantidad: number }>>(url, this.getOptions());
  }

  /**
   * 4) Usuarios por día en una empresa concreta.
   *    GET /dashboard/usuarios/por-dia/:empresa_id
   */
  getUsuariosPorDiaPorEmpresa(
    empresaId: number
  ): Observable<{ empresa_id: number; data: Array<{ fecha: string; cantidad: number }> }> {
    const url = `${this.baseUrl}/usuarios/por-dia/${empresaId}`;
    return this.http.get<{ empresa_id: number; data: Array<{ fecha: string; cantidad: number }> }>(url, this.getOptions());
  }

  /**
   * 5) Cantidad de empresas registradas.
   *    GET /dashboard/empresas/total
   */
  getTotalEmpresas(): Observable<{ totalEmpresas: number }> {
    const url = `${this.baseUrl}/empresas/total`;
    return this.http.get<{ totalEmpresas: number }>(url, this.getOptions());
  }

  /**
   * 6) Obtener productos con stock < 100 para una empresa determinada.
   *    GET /dashboard/productos/bajo-stock/:empresa_id
   */
  getProductosBajoStockPorEmpresa(
    empresaId: number
  ): Observable<Array<{ nombre: string; cantidad: number }>> {
    const url = `${this.baseUrl}/productos/bajo-stock/${empresaId}`;
    return this.http.get<Array<{ nombre: string; cantidad: number }>>(url, this.getOptions());
  }

}