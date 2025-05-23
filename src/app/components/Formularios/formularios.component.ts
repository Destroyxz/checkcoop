import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ) {}

  ngOnInit() {
    // Obtener datos de usuario
    this.userData = this.userStorage.getUser();

    
    //Usuarios según Rol
    if (this.userData?.rol == 'superadmin'){
      this.userService.getAllUsers().subscribe((users: any[]) =>{
        this.users = users;
      },
      (err: any) => {
        console.error('Error al cargar los usuarios', err);
      },
      () => {
        console.log('Carga de usuarios completada');
      })
    } else{
      this.userService.getUsersByCompany(this.userData?.empresa_id).subscribe((users: any[]) =>{
        this.users = users;
      },
      (err: any) => {
        console.error('Error al cargar los usuarios', err);
      },
      () => {
        console.log('Carga de usuarios completada');
      })
    }

    this.loadEmpresas();

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

    this.companyForm = this.fb.group({
      nombre: ['', Validators.required],
      razon_social: ['', Validators.required],
      nif_cif: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      direccion: ['', Validators.required],
      email_contacto: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{7,10}$')]]
    });
    this.userForm.get('turnoPartido')!.valueChanges.subscribe((isOn) => {
      const h2 = this.userForm.get('horaInicio2')!;
      const s2 = this.userForm.get('horaSalida2')!;
      if (isOn) {
        h2.setValidators(Validators.required);
        s2.setValidators(Validators.required);
      } else {
        h2.clearValidators();
        s2.clearValidators();
      }
      h2.updateValueAndValidity();
      s2.updateValueAndValidity();
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
        activo: this.userForm.value.activo,
      };

      this.userService.newUser(nuevoUsuario).subscribe({
        next: (res) => {
          // Mostrar SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Usuario creado!',
            text: `El usuario "${res.nombre}" ha sido creado correctamente.`,
            confirmButtonText: 'OK',
          });

          // Resetear formulario a valores por defecto
          this.userForm.reset({ activo: true, rol: 'usuario' });
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'No se pudo crear el usuario.',
          });
        },
        complete: () => {
          console.log('Petición de creación completada');
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  formMode(formulario: 'crear' | 'modificar'): void {
    this.formulario = formulario;
  }

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
  }

  updateCompany(){
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
  }

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
  }

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
  }


    loadEmpresas() {
    if (this.userData?.rol === 'superadmin') {
      this.companyService.getAllEmpresas().subscribe({
        next: (empresas: any[]) => this.empresas = empresas,
        error: err => console.error('Error al cargar las empresas', err),
        complete: () => console.log('Carga de empresas completada')
      });
    } else {
      this.companyService.getEmpresaById(this.userData?.empresa_id).subscribe({
        next: (empresas: any[]) => this.empresas = empresas,
        error: err => console.error('Error al cargar las empresas', err),
        complete: () => console.log('Carga de empresas completada')
      });
    }
  }



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



    openUserModal(user: any): void {
    this.bsModalRef = this.modalService.show(EditUserModalComponent, { initialState: { data: { ...user } } });
    this.bsModalRef.onHidden?.subscribe(() => {
      const updatedUser: any = this.bsModalRef?.content;
      if (updatedUser) {
        this.handleUpdatedUser(updatedUser);
      }
    });
  }

  private handleUpdatedUser(updatedUser: any): void {
    const idx = this.users.findIndex(u => u.id === updatedUser.id);
    if (idx > -1) {
      this.users[idx] = updatedUser;
    }
    // this.userService.update(updatedUser).subscribe();
  }
}
