import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-changemnt-status',
  templateUrl: './changemnt-status.component.html',
  styleUrls: ['./changemnt-status.component.scss']
})
export class ChangemntStatusComponent implements OnInit {
  
  cols: any = [];
  changementDialog: boolean = false;
  changementForm: FormGroup;
  
  ngOnInit(): void {
    this.changementForm = new FormGroup({
      value1: new FormControl('', Validators.required),
      value2: new FormControl('', Validators.required),
    })
  }
  
  save(){
    if (this.changementForm.valid) {
      
    } else {
      this.validateAllFields(this.changementForm);
    }
  }
  ouvrirDialog() {
    this.changementDialog = true;
  }
  
  fermerDialog() {
    this.changementDialog = false;
  }

  get value1(){
    return this.changementForm.get("value1")
  }

  get value2(){
    return this.changementForm.get("value2")
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
