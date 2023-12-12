import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mobilisation',
  templateUrl: './mobilisation.component.html',
  styleUrls: ['./mobilisation.component.scss']
})
export class MobilisationComponent implements OnInit {
  
  cols: any = [];
  mobilisationDialog: boolean = false;
  mobilisationForm: FormGroup;
  
  ngOnInit(): void {
    this.mobilisationForm = new FormGroup({
      value1: new FormControl('',Validators.required),
      value2: new FormControl('',Validators.required),
    })
  }

  save(){
    if (this.mobilisationForm.valid) {
      
    } else {
      this.validateAllFields(this.mobilisationForm);
    }
  }
  
  ouvrirDialog() {
    this.mobilisationDialog = true;
  }
  
  fermerDialog() {
    this.mobilisationDialog = false;
  }
  
  get value1(){
    return this.mobilisationForm.get("value1");
  }

  get value2(){
    return this.mobilisationForm.get("value2")
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
