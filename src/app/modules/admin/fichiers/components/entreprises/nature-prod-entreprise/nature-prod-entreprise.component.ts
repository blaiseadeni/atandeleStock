import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-nature-prod-entreprise',
  templateUrl: './nature-prod-entreprise.component.html',
  styleUrls: ['./nature-prod-entreprise.component.scss']
})
export class NatureProdEntrepriseComponent implements OnInit {
  
  cols: any = [];
  natureDialog: boolean = false;
  natureForm: FormGroup;

  ngOnInit(): void {
    this.natureForm = new FormGroup({
      value1: new FormControl('',Validators.required),
      value2: new FormControl('',Validators.required),
    })
  }
  
  ouvrirDialog() {
    this.natureDialog = true;
  }

  save(){
    if (this.natureForm.valid) {
      
    } else {
      this.validateAllFields(this.natureForm);
    }
  }
  
  fermerDialog() {
    this.natureDialog = false;
  }

  get value1(){
    return this.natureForm.get("value1");
  }

  get value2(){
    return this.natureForm.get("value2")
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
