import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number; // 👈 ahora es opcional
  numEmpresa: number;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  precio: number; 
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  agregarProducto(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }
  actualizarProducto(producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${producto.id}`, producto);
  }
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
