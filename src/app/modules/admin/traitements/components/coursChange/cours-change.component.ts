import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CoursDeChangeService } from '../../../fichiers/services/cours-de-change.service';
import { MonnaieService } from '../../../fichiers/services/monnaie.service';

@Component({
  selector: 'app-validation-declaration',
  templateUrl: './cours-change.component.html',
  styleUrls: ['./cours-change.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class CoursChangeComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  coursChange: any = {};
  coursChanges: any = [];
  monnaies: any = [];
  
  coursChandeDialog: boolean = false;
  coursChaneForm: FormGroup;
  
  constructor(
    private service: CoursDeChangeService,
    private monnaieService: MonnaieService,
    private messageService: MessageService,
    ) { }
    
    
    ngOnInit(): void {
      this.coursChaneForm = new FormGroup({
        dateEncours: new FormControl('', Validators.required),
        tauxAchat: new FormControl('', Validators.required),
        tauxVente: new FormControl('', Validators.required),
        monnaie: new FormControl('', Validators.required),
      });
      this.getAll();
      this.getAllMonnais();
    }
    
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.coursChanges = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getAllMonnais() {
      this.monnaieService.getAll()
      .subscribe({
        next: (response) => {
          this.monnaies = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.coursChaneForm.valid)
      {
        if(this.coursChange.id){
          this.update();
          this.coursChandeDialog = false;
        }else{
          this.add();
          this.coursChandeDialog = false;
        }
      } else {
        this.validateAllFields(this.coursChaneForm);
      }
      
    }
    
    add() {
      const request = {
        dateEncours: this.dateEncoursValue.value,
        tauxAchat: this.tauxAchatValue.value,
        tauxVente: this.tauxVenteValue.value,
        monnaie: this.monnaieValue.value.devise,
        
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
        dateEncours: this.dateEncoursValue.value,
        tauxAchat: this.tauxAchatValue.value,
        tauxVente: this.tauxVenteValue.value,
        monnaie: this.monnaieValue.value.devise,
        
      }
      
      this.service.update(this.coursChange.id, request)
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
          this.coursChange = response;
          this.coursChaneForm.get("dateEncours")?.patchValue(this.coursChange.dateEncours);
          this.coursChaneForm.get("tauxAchat")?.patchValue(this.coursChange.tauxAchat);
          this.coursChaneForm.get("tauxVente")?.patchValue(this.coursChange.tauxVente);
          this.coursChaneForm.get("monnaie")?.patchValue(this.coursChange.monnaie);
        
          this.coursChandeDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
       this.coursChaneForm.get("dateEncours")?.patchValue('');
          this.coursChaneForm.get("tauxAchat")?.patchValue('');
          this.coursChaneForm.get("tauxVente")?.patchValue('');
          this.coursChaneForm.get("monnaie")?.patchValue('');
      this.coursChange = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
           this.coursChange = response;
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
    
    
    ouvrirDialog() {
      this.coursChandeDialog = true;
    }
    
    fermerDialog() {
      this.coursChandeDialog = false;
    }
    
    get dateEncoursValue(){
      return this.coursChaneForm.get("dateEncours");
    }
    
    get tauxAchatValue(){
      return this.coursChaneForm.get("tauxAchat");
    }
    
    get tauxVenteValue(){
      return this.coursChaneForm.get("tauxVente");
    }
    
    get monnaieValue(){
      return this.coursChaneForm.get("monnaie");
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
  