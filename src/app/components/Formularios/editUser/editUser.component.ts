//Importamos los componentes necesarios 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UserStorageService } from '../../../services/UserStorage.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-editUser',
  templateUrl: 'editUser.component.html',
  styleUrls: ['editUser.component.scss']
})
export class EditUserModalComponent implements OnInit, OnDestroy {
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
      telefono: [this.data.telefono],
      empresa: [this.userData.empresa_id,],
      password: [this.data.password, Validators.required],
      rol: [this.data.rol, Validators.required],
      horaInicio: [this.data.horaInicio, Validators.required],
      horaSalida: [this.data.horaSalida, Validators.required],
      turnoPartido: [this.data.turnoPartido],
      horaInicio2: [this.data.horaInicio2],
      horaSalida2: [this.data.horaSalida2],
      activo: [this.data.activo]
    });

    // Subscription para cambiar validadores de turno 2
    const turnoCtrl = this.userForm.get('turnoPartido')!;
    this.sub = turnoCtrl.valueChanges.subscribe(active => this.toggleSecondShiftValidators(active));

    // Inicializamos el estado según el valor actual
    this.toggleSecondShiftValidators(turnoCtrl.value);
  }

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

  onSave(): void {
    if (this.userForm.invalid) return;

    // Si no hay segundo turno, podríamos limpiar esos campos
    const payload = { id: this.data.id, ...this.userForm.value };
    if (!payload.turnoPartido) {
      delete payload.horaInicio2;
      delete payload.horaSalida2;
    }

    this.userService.update(payload)
      .subscribe(
        resp => {
          this.bsModalRef.content = resp;
          this.bsModalRef.hide();
        },
        error => console.error('Error updating user', error)
      );
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
