import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Item {
  name: string,
  code: string
}

@Component({
  selector: 'app-maj-utilisateur',
  templateUrl: './maj-utilisateur.component.html',
  styleUrls: ['./maj-utilisateur.component.scss']
})
export class  MajUtilisateurComponent implements OnInit {
  
  cols: any = [];
  majutilisateurDialog: boolean = false;
  majutilisateurForm : FormGroup;
  
  items!: Item[];
  selectedItems!: Item[];
  
  ngOnInit(): void {
    
    this.majutilisateurForm = new FormGroup({
      noms : new FormControl('', Validators.required),
      privilege : new FormControl('', Validators.required),
      idDirection : new FormControl('', Validators.required),
    });
    
       this.items = [
        {name: 'Item 1', code: 'NY'},
        {name: 'Item 2', code: 'RM'},
        {name: 'Item 3', code: 'LDN'},
        {name: 'Item 4', code: 'IST'},
        {name: 'Item 5', code: 'PRS'}
      ];
  }
  save(){
    if (this.majutilisateurForm.valid) {
      
    } else {
      this.validateAllFields(this.majutilisateurForm);
    }
  }
  
  ouvrirDialog() {
    this.majutilisateurDialog = true;
  }
  
  fermerDialog() {
    this.majutilisateurDialog = false;
  }
  
  get noms(){
    return this.majutilisateurForm.get("noms");
  }
  
  get privilege(){
    return this.majutilisateurForm.get("privilege");
  }
  
  get idDirection(){
    return this.majutilisateurForm.get("idDirection");
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
