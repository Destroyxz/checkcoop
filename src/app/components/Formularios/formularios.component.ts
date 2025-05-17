import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStorage, UserStorageService } from '../../services/UserStorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-formularios',
    templateUrl: 'formularios.component.html',
    styleUrls: [
        'formularios.component.scss',
    ]
})

export class formulariosComponent implements OnInit {

    mode: 'usuarios' | 'empresas' = 'usuarios';

    userForm!: FormGroup;
    companyForm!: FormGroup;
    userData: UserStorage | null = null ;
    empresas :any[] = [];
    constructor(
        private userStorage: UserStorageService,
        private fb: FormBuilder,
        private companyService: CompanyService,
        private userService: UserService
    ) { }

    ngOnInit() {
    // Obtener datos de usuario
    this.userData = this.userStorage.getUser();

    // Cargar lista de empresas para el select
    this.companyService.getAllCompanies().subscribe(
      (companies: any[]) => {
        this.empresas = companies;
      },
      (err: any) => {
        console.error('Error al cargar empresas', err);
      },
      () => {
        console.log('Carga de empresas completada');
      }
    );

    // Inicializar formulario con todos los campos necesarios
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^\\d{9}$')]],
      rol: ['usuario', Validators.required],         // rol: superadmin, admin, usuario
      empresa: [this.userData?.empresa_id || '', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      activo: [true]
    });
     this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      razon_social: ['', Validators.required],
      nif_cif: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      direccion: ['', Validators.required],
      email_contacto: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{7,10}$')]]
    });
  }

    switchMode(mode: 'usuarios' | 'empresas'): void {
    this.mode = mode;
  }
  submit() {
  if (this.userForm.valid) {
    const nuevoUsuario = {
      nombre: this.userForm.value.nombre,
      apellidos: this.userForm.value.apellidos,
      email: this.userForm.value.email,
      telefono: this.userForm.value.telefono,
      rol: this.userForm.value.rol,
      empresa_id: this.userForm.value.empresa,
      password: this.userForm.value.password,
      activo: this.userForm.value.activo
    };

    this.userService.newUser(nuevoUsuario).subscribe({
      next: (res) => {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Usuario creado!',
          text: `El usuario "${res.nombre}" ha sido creado correctamente.`,
          confirmButtonText: 'OK'
        });

        // Resetear formulario a valores por defecto
        this.userForm.reset({ activo: true, rol: 'usuario' });
      },
      error: (err) => {
        console.error('Error al crear usuario', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'No se pudo crear el usuario.'
        });
      },
      complete: () => {
        console.log('Petición de creación completada');
      }
    });

  } else {
    this.userForm.markAllAsTouched();
  }
    }

submitCompany() {
  if (this.companyForm.valid) {
    const nuevaEmpresa = {
      nombre:          this.companyForm.value.nombre,
      razon_social:    this.companyForm.value.razon_social,
      cif:             this.companyForm.value.nif_cif,
      direccion:       this.companyForm.value.direccion,
      email:           this.companyForm.value.email_contacto,
      telefono:        this.companyForm.value.telefono
    };

    this.companyService.newCompany(nuevaEmpresa).subscribe({
      next: res => {
        Swal.fire('¡Empresa creada!', `Se ha creado ${res.nombre}`, 'success');
        this.companyForm.reset();
      },
      error: err => {
        Swal.fire('Error', err?.error?.message || 'No se pudo crear empresa', 'error');
      }
    });
  } else {
    this.companyForm.markAllAsTouched();
  }
}


}