//Importamos los componentes necesarios
import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import Swal from 'sweetalert2';
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
  //Modelo de ejemplo de cuando creas un producto
  nuevoProducto: Producto = {
    numEmpresa: 1,
    nombre: '',
    descripcion: '',
    cantidad: 0,
    unidad: 'kg',
    categoria: '',
    precio: 0,
    imagen: '',
  };

  //Modelo de ejemplo de cuando actualizas un producto (para inicizalizar las variables si no los pilla bien)
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

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  //Esta funcion permite subir imagenes y limitar su formato
  onFileSelected(event: any, tipo: 'nuevo' | 'editar'): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Tipo de archivo no permitido',
        text: 'Solo se permiten imágenes JPG, PNG, WEBP o GIF.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    // Validar tamaño de archivo
    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'Imagen demasiado grande',
        text: 'La imagen supera los 2 MB permitidos.',
        confirmButtonText: 'Entendido',
      });
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

  //Funcion que obtiene los productos
  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    });
  }

  //Filtra los productos segun su busqueda
  productosFiltrados(): Producto[] {
    return this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
  }

  //Establece el estado del producto segun su cantidad
  getEstadoTexto(p: Producto): string {
    if (p.cantidad === 0) return 'Agotado';
    if (p.cantidad <= 25) return 'Por Vencer';
    return 'Disponible';
  }

  //Establece una clase o otra de bootstrap segun su cantidad
  getEstadoClase(p: Producto): string {
    if (p.cantidad === 0) return 'badge-danger';
    if (p.cantidad <= 25) return 'badge-warning text-dark';
    return 'badge-dark';
  }
  //Funcion que permite agregar productos
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
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: 'Producto creado correctamente.',
          confirmButtonText: 'Aceptar',
        });

        //Reseteamos los valores a los por defecto
        this.mostrarFormulario = false;
        this.nuevoProducto = {
          numEmpresa: 1,
          nombre: '',
          descripcion: '',
          cantidad: 0,
          unidad: 'kg',
          categoria: '',
          precio: 0,
        };
        this.selectedFileNuevo = null;
        this.imagenPreviewNuevo = null;
        this.cargarProductos();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al crear producto. Intenta de nuevo más tarde.',
          confirmButtonText: 'Aceptar',
        });
        console.error(err);
      },
    });
  }

  //Funcion que abre el modal de el producto seleccionado
  abrirModal(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.mostrarModal = true;
  }

  //Funcion que permite cerrar el modal del producto
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  //Funcion que permite guardar los cambios del  producto
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
          Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Producto actualizado correctamente.',
            confirmButtonText: 'Aceptar',
          });

          this.mostrarModal = false;
          this.selectedFileEditar = null;
          this.imagenPreviewEditar = null;
          this.cargarProductos();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar producto.',
            confirmButtonText: 'Aceptar',
          });
          console.error(err);
        },
      });
  }

  //Funcion que permite eliminar el producto seleccionado
  eliminarProducto(producto: Producto): void {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar el producto "${producto.nombre}"?`
    );
    if (!confirmar) return;

    this.productoService.eliminarProducto(producto.id!).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: 'Producto eliminado correctamente.',
          confirmButtonText: 'Aceptar',
        });
        this.cargarProductos();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar producto.',
          confirmButtonText: 'Aceptar',
        });
        console.error(err);
      },
    });
  }
}
