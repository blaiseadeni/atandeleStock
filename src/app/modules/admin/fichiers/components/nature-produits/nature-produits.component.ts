import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nature-produits',
  templateUrl: './nature-produits.component.html',
  styleUrls: ['./nature-produits.component.scss']
})
export class NatureProduitsComponent implements OnInit {
  
  cols: any = [];
  natureDialog : boolean = false;
  natureForm : FormGroup;

  ngOnInit(): void {
    this.natureForm = new FormGroup({
      value1 : new FormControl('', Validators.required),
      value2 : new FormControl('', Validators.required),
    })
  }

  save(){
    if (this.natureForm.valid) {
      
    } else {
      this.validateAllFields(this.natureForm)
    }
  }
  
  ouvrirDialog() {
    this.natureDialog = true;
  }
  
  fermerDialog() {
    this.natureDialog = false;
  }

  get value1(){
    return this.natureForm.get("value1");
  }

  get value2(){
    return this.natureForm.get("value2");
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
