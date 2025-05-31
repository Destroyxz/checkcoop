//Importamos los componentes necesarios
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-editCompany',
  templateUrl: 'editCompany.component.html',
})

export class EditCompanyModalComponent implements OnInit {

  @Output() refresh = new EventEmitter<void>();

  companyForm!: FormGroup;
  data!: any;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private companyService: CompanyService,
  ) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      nombre: [this.data.nombre, Validators.required],
      razon_social: [this.data.razon_social, Validators.required],
      nif_cif: [this.data.nif_cif, Validators.required],
      direccion: [this.data.direccion],
      email_contacto: [this.data.email_contacto, [Validators.required, Validators.email]],
      telefono: [this.data.telefono]
    });
  }

  //Guardar los cambios
  onSave(): void {
    if (this.companyForm.invalid) return;
    const updatedcompany = { id: this.data.id, ...this.companyForm.value };
    this.companyService.update(updatedcompany)
      .subscribe(
        resp => { this.bsModalRef.content = resp; this.bsModalRef.hide(); },
        error => { console.error('Error updating user', error); }
      );

    this.refresh.emit();
  }

  //Cancelar edicion
  onCancel(): void {
    this.bsModalRef.hide();
  }
}
