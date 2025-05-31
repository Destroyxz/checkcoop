//Importamos los módulos necesarios
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UserStorageService } from '../../../services/UserStorage.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-editUser',
  templateUrl: 'editUser.component.html',
  styleUrls: ['editUser.component.scss']
})


// Componente para editar un usuario
export class EditUserModalComponent implements OnInit, OnDestroy {


  @Output() userSaved = new EventEmitter<any>();


  userForm!: FormGroup;
  data!: any;
  userData!: any;
  private sub!: Subscription;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private userStorageService: UserStorageService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userData = this.userStorageService.getUser();

    this.userForm = this.fb.group({
      nombre: [this.data.nombre, Validators.required],
      apellidos: [this.data.apellidos, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      empresa: [this.data.empresa_id, Validators.required],
      telefono: [this.data.telefono, [Validators.pattern('^\\d{9}$')]],
      rol: [this.data.rol, Validators.required],
      password: ['', Validators.required],
      activo: [this.data.activo],

      horaInicio: [this.data.horaInicio, Validators.required],
      horaSalida: [this.data.horaSalida, Validators.required],
      turnoPartido: [this.data.turnoPartido],
      horaInicio2: [this.data.horaInicio2],
      horaSalida2: [this.data.horaSalida2],
    });

    const turnoCtrl = this.userForm.get('turnoPartido')!;
    this.sub = turnoCtrl.valueChanges.subscribe(active => this.toggleSecondShiftValidators(active));
    this.toggleSecondShiftValidators(turnoCtrl.value);
  }

  // Método para activar / desactivar los validadores del segundo turno
  private toggleSecondShiftValidators(active: boolean) {
    const ini2 = this.userForm.get('horaInicio2')!;
    const fin2 = this.userForm.get('horaSalida2')!;

    if (active) {
      ini2.setValidators([Validators.required]);
      fin2.setValidators([Validators.required]);
    } else {
      ini2.clearValidators();
      fin2.clearValidators();
    }
    ini2.updateValueAndValidity();
    fin2.updateValueAndValidity();
  }

  // Método que se ejecuta al cargar el componente
  onSave(): void {
    if (this.userForm.invalid) return;

    const f = this.userForm.value;
    const payload: any = {
      id: this.data.id,
      nombre: f.nombre,
      apellidos: f.apellidos,
      email: f.email,
      telefono: f.telefono,
      rol: f.rol,
      empresa_id: this.data.empresa_id,
      password: f.password,
      activo: f.activo,
      horaInicio: f.horaInicio,
      horaSalida: f.horaSalida,
      turnoPartido: f.turnoPartido
    };

    if (f.turnoPartido) {
      payload.horaInicio2 = f.horaInicio2;
      payload.horaSalida2 = f.horaSalida2;
    }

    // Llama al servicio update que recibe el objeto completo
    this.userService.update(payload)
      .subscribe(
        resp => {
          this.bsModalRef.content = resp;
          this.bsModalRef.hide();
          this.userSaved.emit(resp);
        },
        error => console.error('Error updating user', error)
      );
  }

  // Método que se ejecuta al cancelar la edición
  onCancel(): void {
    this.bsModalRef.hide();
  }

  // Método que se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}