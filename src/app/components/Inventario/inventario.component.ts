import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
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
    precio: 0,
    imagen: '',
  };

  productoSeleccionado: Producto = {
    id: 0,
    numEmpresa: 1,
    nombre: '',
    descripcion: '',
    cantidad: 0,
    unidad: '',
    categoria: '',
    precio: 0,
    imagen: '',
  };
  selectedFileNuevo: File | null = null;
  selectedFileEditar: File | null = null;

  imagenPreviewNuevo: string | null = null;
  imagenPreviewEditar: string | null = null;

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }
  onFileSelected(event: any, tipo: 'nuevo' | 'editar'): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > maxSize) {
      alert('La imagen es demasiado grande. Máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (tipo === 'nuevo') {
        this.selectedFileNuevo = file;
        this.imagenPreviewNuevo = e.target?.result as string;
      } else {
        this.selectedFileEditar = file;
        this.imagenPreviewEditar = e.target?.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    });
  }

  productosFiltrados(): Producto[] {
    return this.productos.filter((p) =>
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
    const formData = new FormData();
    Object.entries(this.nuevoProducto).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (this.selectedFileNuevo) {
      formData.append('imagen', this.selectedFileNuevo);
    }

    this.productoService.agregarProducto(formData).subscribe({
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
          precio: 0,
        };
        this.selectedFileNuevo = null;
        this.imagenPreviewNuevo = null;
        this.cargarProductos();
      },
      error: (err) => {
        alert('Error al crear producto');
        console.error(err);
      },
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
    const formData = new FormData();
    Object.entries(this.productoSeleccionado).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.selectedFileEditar) {
      formData.append('imagen', this.selectedFileEditar);
    } else {
      formData.append('imagenActual', this.productoSeleccionado.imagen || '');
    }

    this.productoService
      .actualizarProducto(this.productoSeleccionado.id!, formData)
      .subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.mostrarModal = false;
          this.selectedFileEditar = null;
          this.imagenPreviewEditar = null;
          this.cargarProductos();
        },
        error: (err) => {
          alert('Error al actualizar producto');
          console.error(err);
        },
      });
  }

  eliminarProducto(producto: Producto): void {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar el producto "${producto.nombre}"?`
    );
    if (!confirmar) return;

    this.productoService.eliminarProducto(producto.id!).subscribe({
      next: () => {
        alert('Producto eliminado correctamente');
        this.cargarProductos();
      },
      error: (err) => {
        alert('Error al eliminar producto');
        console.error(err);
      },
    });
  }
}
