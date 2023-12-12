import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-activite-secondaire',
  templateUrl: './activite-secondaire.component.html',
  styleUrls: ['./activite-secondaire.component.scss']
})
export class ActiviteSecondaireComponent implements OnInit {
  
  cols: any = [];
  activiteDialog: boolean = false;
  activiteForm: FormGroup;
  
  ngOnInit(): void {
    this.activiteForm = new FormGroup({
      value1: new FormControl('',Validators.required),
      value2: new FormControl('',Validators.required),
    })
  }
  
  save(){
    if (this.activiteForm.valid) {
      
    } else {
      this.validateAllFields(this.activiteForm);
    }
  }
  ouvrirDialog() {
    this.activiteDialog = true;
  }
  
  fermerDialog() {
    this.activiteDialog = false;
  }

  get value1(){
    return this.activiteForm.get("value1");
  }

  get value2(){
    return this.activiteForm.get("value2");
  }

  private validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field)

      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control)
      }
    })
  }
}
