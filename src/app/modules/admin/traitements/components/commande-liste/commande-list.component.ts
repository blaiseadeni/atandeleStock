import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-controle-declaration',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CommandeListComponent implements OnInit {
  
  cols : any = [];
  controleDialog: boolean = false;
  deleteDialog: boolean = false;
  
  controleForm: FormGroup;
  
  commande: any = {};
  commandes: any = [];
  
  constructor(
    private service: CommandeService,
    private messageService: MessageService,
    ) { }
    
    ngOnInit(): void {
      this.controleForm = new FormGroup({
        value1: new FormControl('', Validators.required),
        value2: new FormControl('', Validators.required),
      })
      this.getAll();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.commandes = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.controleForm.valid) {
        
      } else {
        this.validateAllFields(this.controleForm);
      }
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.commande = response;
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
    
    ouvrirDialog(){
      this.controleDialog = true;
    }
    
    fermerDialog(){
      this.controleDialog = false;
    }
    
    get value() {
      return this.controleForm.get("value");
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
  