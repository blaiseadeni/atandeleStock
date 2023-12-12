import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmballageService } from '../../services/emballage.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-creation-mvm-comp',
  templateUrl: './emballage.component.html',
  styleUrls: ['./emballage.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class EmballageComponent implements OnInit{
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  emballageDialog: boolean = false;
  emballageForm: FormGroup;
  
  emballages: any = [];
  emballage: any = {};
  
  constructor(
    private service: EmballageService,
    private messageService: MessageService,
    ){}
    
    ngOnInit(): void {
      
      this.emballageForm = new FormGroup({
        libelle : new FormControl('', Validators.required),
      })
      this.getAll();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.emballages = response;
          console.log(this.emballages);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.emballageForm.valid)
      {
        if(this.emballage.id){
          this.update();
          this.emballageDialog = false;
        }else{
          this.add();
          this.emballageDialog = false;
        }
      } else {
        this.validateAllFields(this.emballageForm);
      }
      
    }
    
    add() {
      const request = {
        libelle: this.libelleValue.value,
        
      }
      this.service.add(request)
      .subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.getAll();
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.getAll();
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: 'Enregistrer avec succès', life: 3000 });
          this.getAll();
          this.reset();
        }
      });
    }
    
    update() {
      const request = {
        libelle: this.libelleValue.value,
        
      }
      
      this.service.update(this.emballage.id, request)
      .subscribe({
        next: (response) => {
          this.getAll();
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: ' Modifier avec succès', life: 3000 });
          this.getAll();
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: 'Modifier avec succès', life: 3000 });
          this.getAll();
          this.reset();
        }
      })
    }
    
    delete(id: any) {
      this.service.delete(id)
      .subscribe({
        next: (response) => {
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: ' Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: 'Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
          this.reset();
        }
      });
    }
    
    find(id:any):any {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.emballage = response;
          this.emballageForm.get("libelle")?.patchValue(this.emballage.libelle);
          this.emballageDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.emballageForm.get("libelle")?.patchValue('');
      this.emballage = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.emballage = response;
          this.deleteDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    hideSelect() {
      this.deleteDialog = false;
      this.reset();
    }
    
    
    ouvrirDialog(){
      this.emballageDialog = true;
    }
    
    fermerDialog(){
      this.emballageDialog = false;
    }
    
    
    get libelleValue(){
      return this.emballageForm.get("libelle");
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
  