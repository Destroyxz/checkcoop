import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  filtroBusqueda: string = '';
  mostrarFormulario = false;
  mostrarModal: boolean = false;

  nuevoProducto: Producto = {
    numEmpresa: 1,
    nombre: '',
    descripcion: '',
    cantidad: 0,
    unidad: 'unidad',
    categoria: '',
    precio: 0
  };

  productoSeleccionado: Producto = {
    id: 0,
    numEmpresa: 1,
    nombre: '',
    descripcion: '',
    cantidad: 0,
    unidad: '',
    categoria: '',
    precio: 0
  };

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
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

  agregarProducto(): void {
    this.productoService.agregarProducto(this.nuevoProducto).subscribe({
      next: () => {
        alert('Producto creado correctamente');
        this.mostrarFormulario = false;
        this.nuevoProducto = {
          numEmpresa: 1,
          nombre: '',
          descripcion: '',
          cantidad: 0,
          unidad: 'unidad',
          categoria: '',
          precio: 0
        };
        this.cargarProductos();
      },
      error: err => {
        alert('Error al crear producto');
        console.error(err);
      }
    });
  }

  abrirModal(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarCambios(): void {
    this.productoService.actualizarProducto(this.productoSeleccionado).subscribe({
      next: () => {
        alert('Producto actualizado correctamente');
        this.mostrarModal = false;
        this.cargarProductos();
      },
      error: err => {
        alert('Error al actualizar producto');
        console.error(err);
      }
    });
  }

  eliminarProducto(producto: Producto): void {
    const confirmar = confirm(`¿Seguro que deseas eliminar el producto "${producto.nombre}"?`);
    if (!confirmar) return;

    this.productoService.eliminarProducto(producto.id!).subscribe({
      next: () => {
        alert('Producto eliminado correctamente');
        this.cargarProductos();
      },
      error: err => {
        alert('Error al eliminar producto');
        console.error(err);
      }
    });
  }
}
