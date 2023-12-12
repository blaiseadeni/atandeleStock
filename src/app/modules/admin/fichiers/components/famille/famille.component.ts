import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FamilleService } from '../../services/famille.service';
import { Table } from 'primeng/table';

interface Item {
  name: string,
  code: string
}

@Component({
  selector: 'app-creation-utilisateurs',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.scss'],
  providers: [MessageService, ConfirmationService]
})


export class FamilleComponent  implements OnInit{
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  familleDialog: Boolean = false;
  familleForm: FormGroup;
  famille: any = {};
  familles: any = [];
  
  items!: Item[];
  selectedItems!: Item[];
  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private service: FamilleService
    ) {}
    
    ngOnInit(): void{
      this.familleForm = new FormGroup({
        libelle : new FormControl('', Validators.required),
      });
      
      this.getAll();
    }
    
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.familles = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.familleForm.valid)
      {
        if(this.famille.id){
          this.update();
          this.familleDialog = false;
        }else{
          this.add();
          this.familleDialog = false;
        }
      } else {
        this.validateAllFields(this.familleForm);
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
      
      this.service.update(this.famille.id, request)
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
          this.famille = response;
          this.familleForm.get("libelle")?.patchValue(this.famille.libelle);
          this.familleDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.familleForm.get("libelle")?.patchValue('');
      this.famille = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.famille = response;
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
      this.familleDialog = true;
    }
    
    fermerDialog(){
      this.familleDialog = false;
    }
    
    get libelleValue(){
      return this.familleForm.get("libelle");
    }
    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
  