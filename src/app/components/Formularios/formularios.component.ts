// Importamos los servicios necesarios
import { Component, OnInit } from '@angular/core';
import {
  UserStorage,
  UserStorageService,
} from '../../services/UserStorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { EditCompanyModalComponent } from './editCompany/editCompany.component';
import { EditUserModalComponent } from './editUser/editUser.component';
@Component({
  selector: 'app-formularios',
  templateUrl: 'formularios.component.html',
  styleUrls: ['formularios.component.scss'],
})
export class formulariosComponent implements OnInit {

  bsModalRef?: BsModalRef;

  mode: 'usuarios' | 'empresas' = 'usuarios';
  formulario: 'crear' | 'modificar' = 'crear';
  userForm!: FormGroup;
  companyForm!: FormGroup;

  userData: UserStorage | null = null;

  filterText: string = '';
  selectedCompany: string = '';
  filterTextEmpresa = '';
  filterTipoEmpresa = '';

  users: any[] = [];
  empresas: any[] = [];

  constructor(
    private userStorage: UserStorageService,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    // Obtener datos de usuario
    this.userData = this.userStorage.getUser();


    //Usuarios según Rol

    this.loadusers()


    // Cargar empresas
    this.loadEmpresas();

    // Inicializar formulario de usuario
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      empresa: [''],
      password: ['', Validators.required],
      activo: [true],
      rol: ['', Validators.required],

      horaInicio: ['', Validators.required],
      horaSalida: ['', Validators.required],
      turnoPartido: [false],

      horaInicio2: [''],
      horaSalida2: [''],
    });

    // Inicializar formulario de empresa
    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      razon_social: ['', Validators.required],
      nif_cif: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      direccion: ['', Validators.required],
      email_contacto: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{7,10}$')]]
    });

    // Validadores dinámicos para turno partido
    this.userForm.get('turnoPartido')!.valueChanges.subscribe(isOn => {
      const hIn2 = this.userForm.get('horaInicio2')!;
      const hOut2 = this.userForm.get('horaSalida2')!;

      if (isOn) {
        hIn2.setValidators(Validators.required);
        hOut2.setValidators(Validators.required);
      } else {
        hIn2.clearValidators();
        hOut2.clearValidators();
      }
      hIn2.updateValueAndValidity();
      hOut2.updateValueAndValidity();
    });

  }

  // Cargar usuarios según el rol del usuario actual
  loadusers() {

    if (this.userData?.rol == 'superadmin') {
      this.userService.getAllUsers().subscribe((users: any[]) => {
        this.users = users;
      },
        (err: any) => {
          console.error('Error al cargar los usuarios', err);
        },
        () => {
        })
    } else {
      this.userService.getUsersByCompany(this.userData?.empresa_id).subscribe((users: any[]) => {
        this.users = users;
      },
        (err: any) => {
          console.error('Error al cargar los usuarios', err);
        },
        () => {
        })
    }

  }
  // Cambia el modo entre usuarios y empresas
  switchMode(mode: 'usuarios' | 'empresas'): void {
    this.mode = mode;
  }

  //Enviar formulario de usuario
  submit() {
    if (this.userForm.valid) {
      const f = this.userForm.value;

      // Si f.empresa está vacío ("" o null o undefined), tomar userData.empresa_id
      const empresaAEnviar = f.empresa || this.userData?.empresa_id;

      const nuevoUsuario = {
        nombre: f.nombre,
        apellidos: f.apellidos,
        email: f.email,
        telefono: f.telefono,
        rol: f.rol,
        empresa_id: empresaAEnviar,
        password: f.password,
        activo: f.activo,
        horaInicio: f.horaInicio,
        horaSalida: f.horaSalida,
        turnoPartido: f.turnoPartido,
        horaInicio2: f.turnoPartido ? f.horaInicio2 : undefined,
        horaSalida2: f.turnoPartido ? f.horaSalida2 : undefined,
      };

      this.userService.newUser(nuevoUsuario).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: '¡Usuario creado!',
            text: `El usuario "${res.nombre}" ha sido creado correctamente.`,
            confirmButtonText: 'OK',
          });
          // Resetea sólo los valores por defecto
          this.userForm.reset({ activo: true, rol: 'usuario', empresa: '' });
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'No se pudo crear el usuario. Compruebe que el email no esté duplicado o los campos no estén mal rellenados.',
          });
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }

    setTimeout(this.loadusers, 1500)
  }
  // Cambia el modo del formulario (crear/modificar)
  formMode(formulario: 'crear' | 'modificar'): void {
    this.formulario = formulario;
  }

  // Enviar formulario de empresa
  submitCompany() {
    if (this.companyForm.valid) {
      const nuevaEmpresa = {
        nombre: this.companyForm.value.nombre,
        razon_social: this.companyForm.value.razon_social,
        cif: this.companyForm.value.nif_cif,
        direccion: this.companyForm.value.direccion,
        email: this.companyForm.value.email_contacto,
        telefono: this.companyForm.value.telefono,
      };

      this.companyService.newCompany(nuevaEmpresa).subscribe({
        next: (res) => {
          Swal.fire(
            '¡Empresa creada!',
            `Se ha creado ${res.nombre}`,
            'success'
          );
          this.companyForm.reset();
          this.loadEmpresas()
        },
        error: (err) => {
          Swal.fire(
            'Error',
            err?.error?.message || 'No se pudo crear la empresa. Verifique que su CIF sea válido',
            'error'
          );
        },
      });
    } else {
      this.companyForm.markAllAsTouched();
    }

    this.loadusers()

  }

  // Actualizar compañia
  updateCompany() {
    if (this.companyForm.valid) {
      const nuevaEmpresa = {
        nombre: this.companyForm.value.nombre,
        razon_social: this.companyForm.value.razon_social,
        cif: this.companyForm.value.nif_cif,
        direccion: this.companyForm.value.direccion,
        email: this.companyForm.value.email_contacto,
        telefono: this.companyForm.value.telefono,
      };

      this.companyService.newCompany(nuevaEmpresa).subscribe({
        next: (res) => {
          Swal.fire(
            '¡Empresa creada!',
            `Se ha creado ${res.nombre}`,
            'success'
          );
          this.companyForm.reset();
        },
        error: (err) => {
          Swal.fire(
            'Error',
            err?.error?.message || 'No se pudo crear empresa',
            'error'
          );
        },
      });
    } else {
      this.companyForm.markAllAsTouched();
    }

    this.loadusers()

  }
  //Borrar empresa
  deleteEmpresa(e: any) {
    Swal.fire({
      title: `¿Eliminar la empresa "${e.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.companyService.deleteEmpresa(e.id).subscribe({
          next: () => {
            this.empresas = this.empresas.filter(x => x.id !== e.id);
            Swal.fire(
              'Eliminada',
              `La empresa "${e.nombre}" ha sido eliminada.`,
              'success'
            );
          },
          error: err => {
            console.error('Error eliminando empresa', err);
            Swal.fire(
              'Error',
              'No se pudo eliminar la empresa.',
              'error'
            );
          }
        });
      }
    });

    this.loadusers()

  }

  //Borrar Usuario
  deleteUser(u: any) {
    Swal.fire({
      title: `¿Eliminar al usuario "${u.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteUser(u.id).subscribe({
          next: () => {
            this.users = this.users.filter(x => x.id !== u.id);
            Swal.fire(
              'Eliminado',
              `El usuario "${u.nombre}" ha sido eliminado.`,
              'success'
            );
          },
          error: err => {
            console.error('Error eliminando usuario', err);
            Swal.fire(
              'Error',
              'No se pudo eliminar el usuario.',
              'error'
            );
          }
        });
      }
    });

    this.loadusers()

  }

  //Cargar empresa
  loadEmpresas() {
    if (this.userData?.rol === 'superadmin') {
      this.companyService.getAllEmpresas().subscribe({
        next: (empresas: any[]) => this.empresas = empresas,
        error: err => console.error('Error al cargar las empresas', err),
      });
    } else {
      this.companyService.getEmpresaById(this.userData?.empresa_id).subscribe({
        next: (empresas: any[]) => this.empresas = empresas,
        error: err => console.error('Error al cargar las empresas', err),
      });
    }
  }


  //Abrir modal para editar la empresa
  openCompanyModal(company: any): void {
    this.bsModalRef = this.modalService.show(EditCompanyModalComponent, { initialState: { data: { ...company } } });
    // Al cerrar, recibimos el objeto actualizado en bsModalRef.content
    this.bsModalRef.onHidden?.subscribe(() => {
      const updated: any = this.bsModalRef?.content;
      if (updated) {
        this.loadEmpresas();
        this.bsModalRef?.hide();

      }
    });
  }


  //Abrir modal para editar usuario
  openUserModal(user: any): void {
    this.bsModalRef = this.modalService.show(EditUserModalComponent, {
      initialState: { data: { ...user } }
    });

    const child = this.bsModalRef.content as EditUserModalComponent;

    child.userSaved.subscribe(() => {
      this.loadusers();
      this.bsModalRef?.hide();
    });
  }

}
