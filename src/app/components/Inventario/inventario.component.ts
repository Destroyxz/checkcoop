import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  filtroBusqueda: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
    });
  }

  productosFiltrados(): Producto[] {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
  }

  getEstadoTexto(p: Producto): string {
    if (p.cantidad === 0) return 'Agotado';
    if (p.cantidad <= 25) return 'Por Vencer';
    return 'Disponible';
  }

  getEstadoClase(p: Producto): string {
    if (p.cantidad === 0) return 'badge-danger';
    if (p.cantidad <= 25) return 'badge-warning text-dark';
    return 'badge-dark';
  }
  nuevoProducto = {
    numEmpresa: 1,
    nombre: '',
    descripcion: '',
    cantidad: 0,
    unidad: 'unidad',
    categoria: '',
    precio: 0
  };
  
  mostrarFormulario = false;
  
  agregarProducto() {
    this.productoService.agregarProducto(this.nuevoProducto).subscribe({
      next: res => {
        alert('Producto creado correctamente');
        this.mostrarFormulario = false;
        this.nuevoProducto = { numEmpresa: 1, nombre: '', descripcion: '', cantidad: 0, unidad: 'unidad', categoria: '', precio: 0 };
        this.ngOnInit(); // Recargar productos
      },
      error: err => {
        alert('Error al crear producto');
        console.error(err);
      }
    });
  }
  
}
