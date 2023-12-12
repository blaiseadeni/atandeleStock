import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-entreprises',
  templateUrl: './status-entreprises.component.html',
  styleUrls: ['./status-entreprises.component.scss']
})
export class StatusEntreprisesComponent implements OnInit {
  
  cols: any = [];
  statusDialog: boolean = false;
  statusForm: FormGroup;
  
  ngOnInit(): void{
    this.statusForm = new FormGroup({
      value1: new FormControl('',Validators.required),
      value2: new FormControl('',Validators.required),
    })
  }

  save(){
    if(this.statusForm.valid){

    }else{
      this.validateAllFields(this.statusForm)
    }
  }
  
  ouvrirDialog() {
    this.statusDialog = true;
  }
  
  fermerDialog() {
    this.statusDialog = false;
  }

  get value1(){
    return this.statusForm.get('value1');
  }

  get value2(){
    return this.statusForm.get('value2');
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
