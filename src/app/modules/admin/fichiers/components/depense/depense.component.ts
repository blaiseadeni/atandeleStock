import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DepenseService } from '../../services/depense.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class DepenseComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  depense: any = {};
  depenses: any = [];
  
  
  depenseDialog: boolean = false;
  depenseForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private service: DepenseService,
    private messageService: MessageService,
    ) { }
    
    ngOnInit(): void {
      this.depenseForm = new FormGroup({
        montant: new FormControl('', Validators.required),
        motif: new FormControl('', Validators.required),
        beneficiaire:  new FormControl('', Validators.required),
      });
      this.getAll();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.depenses = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.depenseForm.valid)
      {
        if(this.depense.id){
          this.update();
          this.depenseDialog = false;
        }else{
          this.add();
          this.depenseDialog = false;
        }
      } else {
        this.validateAllFields(this.depenseForm);
      }
      
    }
    
    add() {
      const request = {
        montant: this.montantValue.value,
        motif: this.motifValue.value,
        beneficiaire: this.beneficiaireValue.value,
      }
      console.log(request);
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
        montant: this.montantValue.value,
        motif: this.motifValue.value,
        beneficiaire: this.beneficiaireValue.value,
        
      }
      
      this.service.update(this.depense.id, request)
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
          this.depense = response;
          this.depenseForm.get("montant")?.patchValue(this.depense.montant);
          this.depenseForm.get("motif")?.patchValue(this.depense.motif);
          this.depenseForm.get("beneficiaire")?.patchValue(this.depense.beneficiaire);
          
          this.depenseDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.depense = response;
          this.deleteDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.depenseForm = this.fb.group({
        montant: [],
        motif: [],
        beneficiaire: []
      });
      this.depense = {};
    }
    
    hideSelect() {
      this.deleteDialog = false;
      this.reset();
    }
    
    ouvrirDialog() {
      this.depenseDialog = true;
    }
    
    fermerDialog() {
      this.depenseDialog = false;
      this.depense = {};
    }
    
    
    get montantValue() {
      return this.depenseForm.get("montant");
    }
    
    get motifValue(){
      return this.depenseForm.get("motif")
    }
    
    get beneficiaireValue(){
      return this.depenseForm.get("beneficiaire")
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