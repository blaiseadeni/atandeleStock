import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AchatService } from '../../services/achat.service';

@Component({
  selector: 'app-verif-genere-penal',
  templateUrl: './achat-list.component.html',
  styleUrls: ['./achat-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AchatListComponent implements OnInit {
  
  cols: any = [];
  deleteDialog: boolean = false;
  
  achat: any = {};
  achats: any = [];
  
  varificationDialog : boolean = false;
  verificationForm: FormGroup;
  
  constructor(
    private service: AchatService,
    private messageService: MessageService,
    ) { }
    
    ngOnInit(): void {
      this.verificationForm = new FormGroup({
        value1: new FormControl('', Validators.required),
        value2: new FormControl('', Validators.required),
      })
      this.getAll();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.achats = response;
          console.log(this.achats);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.achat = response;
          this.deleteDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    delete(id: any) {
      this.service.delete(id)
      .subscribe({
        next: (response) => {
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: ' Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: 'Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
        }
      });
    }
    
    hideSelect() {
      this.deleteDialog = false;
    }
    
    save(){
      if (this.verificationForm.valid) {
        
      } else {
        this.validateAllFields(this.verificationForm);      
      }
    }
    
    ouvrirDialog(){
      this.varificationDialog = true;
    }
    
    fermerDialog(){
      this.varificationDialog = false;
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
  