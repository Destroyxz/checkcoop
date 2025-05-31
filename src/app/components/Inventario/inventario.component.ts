// Importamos los componentes necesarios
import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import Swal from 'sweetalert2';
import { UserStorageService } from '../../services/UserStorage.service';

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

  userData: any; // Almacena los datos del usuario actual

  // Declaramos nuevoProducto sin inicializarlo aún
  nuevoProducto!: Producto;

  // Modelo para cuando actualizas un producto. Se inicializa con valores genéricos,
  // pero asignamos numEmpresa desde userData cuando cargamos el usuario.
  productoSeleccionado!: Producto;

  selectedFileNuevo: File | null = null;
  selectedFileEditar: File | null = null;

  imagenPreviewNuevo: string | null = null;
  imagenPreviewEditar: string | null = null;

  constructor(
    private productoService: ProductoService,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit(): void {
    this.cargarEmpresa();
    this.cargarProductos();
  }


  cargarEmpresa(): void {
    this.userData = this.userStorageService.getUser();

    // Validamos que userData exista y tenga numEmpresa
    if (!this.userData || this.userData.empresa_id == null) {
      console.warn(
        'No se encontraron datos de usuario o numEmpresa. Se asignará 0 por defecto.'
      );
    }

    // Inicializamos ambos modelos usando el numEmpresa obtenido (o 0 si no existe)
    this.inicializarNuevoProducto();
    this.inicializarProductoSeleccionado();
  }

  //Inializa el payload del nuevo producto
  inicializarNuevoProducto(): void {
    const numEmp = this.userData?.empresa_id ?? 0;
    this.nuevoProducto = {
      numEmpresa: numEmp,
      nombre: '',
      descripcion: '',
      cantidad: 0,
      unidad: 'kg',
      categoria: '',
      precio: 0,
      imagen: '',
    };
  }

  //Inicializa el payload del producto a editar
  inicializarProductoSeleccionado(): void {
    const numEmp = this.userData?.empresa_id ?? 0;
    this.productoSeleccionado = {
      id: 0,
      numEmpresa: numEmp,
      nombre: '',
      descripcion: '',
      cantidad: 0,
      unidad: 'kg',
      categoria: '',
      precio: 0,
      imagen: '',
    };
  }

  // Muestra el formulario para agregar un nuevo producto
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

  // Carga los productos desde el servicio y los asigna a la variable productos.
  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    });
  }

  // Filtra los productos según el texto de búsqueda ingresado.
  productosFiltrados(): Producto[] {
  const empresaId = this.userData?.empresa_id;

  return this.productos
    .filter(p => p.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()))
    .filter(p => this.userData?.rol === 'superadmin' || p.numEmpresa === empresaId);
}


  // Devuelve el texto del estado del stock según la cantidad del producto.
  getEstadoTexto(p: Producto): string {
    if (p.cantidad === 0) return 'Agotado';
    if (p.cantidad <= 25) return 'Por Vencer';
    return 'Disponible';
  }

  // Devuelve la clase CSS correspondiente al estado del producto según su cantidad.
  getEstadoClase(p: Producto): string {
    if (p.cantidad === 0) return 'badge-danger';
    if (p.cantidad <= 25) return 'badge-warning text-dark';
    return 'badge-dark';
  }

  // Abre el formulario para agregar un nuevo producto.
  agregarProducto(): void {
    // Antes de crear, podemos verificar numEmpresa:
    if (this.nuevoProducto.numEmpresa === 0) {
      console.warn(
        'Intentando guardar con numEmpresa = 0. Revisa userData o iniciar sesión de nuevo.'
      );
    }

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

        // Reseteamos formulario y volvemos a inicializar nuevoProducto
        this.mostrarFormulario = false;
        this.inicializarNuevoProducto();
        this.selectedFileNuevo = null;
        this.imagenPreviewNuevo = null;
        this.cargarProductos();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al crear producto. Comprueba que los campos estén completos.',
          confirmButtonText: 'Aceptar',
        });
        console.error(err);
      },
    });
  }

  // Abre el modal para editar un producto seleccionado.
  abrirModal(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
    this.mostrarModal = true;
  }

  // Cierra el modal de edición y resetea los campos.
  cerrarModal(): void {
    this.mostrarModal = false;
    this.selectedFileEditar = null;
    this.imagenPreviewEditar = null;
    // Después de cerrar, volvemos a resetear a valores por defecto (si así se desea)
    this.inicializarProductoSeleccionado();
  }

  // Guarda los cambios del producto editado.
  guardarCambios(): void {
    if (!this.productoSeleccionado.id) {
      console.error('El producto seleccionado no tiene ID válido');
      return;
    }

    // Validamos que numEmpresa no se haya perdido
    if (this.productoSeleccionado.numEmpresa === 0) {
      console.warn(
        'Intentando actualizar con numEmpresa = 0. Revisa userData o recarga la página.'
      );
    }

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
      .actualizarProducto(this.productoSeleccionado.id, formData)
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

          this.inicializarProductoSeleccionado();
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

  // Elimina un producto después de confirmar la acción.
  eliminarProducto(producto: Producto): void {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar el producto "${producto.nombre}"?`
    );
    if (!confirmar) return;

    if (!producto.id) {
      console.error('El producto a eliminar no tiene ID válido');
      return;
    }

    this.productoService.eliminarProducto(producto.id).subscribe({
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
