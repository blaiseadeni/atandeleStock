import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DepenseService } from '../../services/depense.service';
import { Table } from 'primeng/table';
import { JwtHelperService } from '@auth0/angular-jwt';


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
  
  verificationDialog: boolean = false;
  verificationForm: FormGroup;
  
  utilisateurId: any;
  locationId: any;
  role: any;
  
  montant: any={};
  
  constructor(
    private fb: FormBuilder,
    private service: DepenseService,
    private messageService: MessageService,
    private jwtHelper: JwtHelperService
    ) { }
    
    ngOnInit(): void {
      this.depenseForm = new FormGroup({
        montant: new FormControl('', Validators.required),
        motif: new FormControl('', Validators.required),
        beneficiaire:  new FormControl('', Validators.required),
      });
      this.verificationForm = new FormGroup({
        date1: new FormControl('', Validators.required),
        date2: new FormControl('', Validators.required),
      });
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      this.role = decodeJWT.role;
      
      this.getAll();
    }
    
    getAll() {
      this.service.getAll(this.locationId)
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
        utilisateurId:this.utilisateurId
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
    
    
    verify() {
      const request = {
        date1: this.date1Value.value,
        date2: this.date2Value.value,
        locationId: this.locationId,
      }
      // console.log(request);
      const value = JSON.stringify(request)
      console.log(value);
      if (request.date1.getTime() > request.date2.getTime()) {
        this.messageService.add({ severity: 'error', summary: 'Info', detail: 'Dates invalides', life: 3000 });
      } else {
        this.service.verify(value)
        .subscribe({
          next: (response) => {
            this.montant = response;
            // console.log(this.montant = response);
            // alert(this.montant.montant)
            
          },
          error: (e) => {
            console.log(e);
          }
        });
      }
      
    }
    
    getAmount() {
      if (this.verificationForm.valid) {
        
        this.verify();
      } else {
        this.validateAllFields(this.verificationForm)
      }
    }
    
    update() {
      const request = {
        montant: this.montantValue.value,
        motif: this.motifValue.value,
        beneficiaire: this.beneficiaireValue.value,
        utilisateurId:this.utilisateurId
        
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
    
    resetAmount() {
      this.verificationForm = this.fb.group({
        date1: [],
        date2: [],
      });
      this.montant = {};
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
    ouvrirVDialog() {
      this.verificationDialog = true;
    }
    
    fermerVDialog() {
      this.verificationDialog = false;
      this.resetAmount();
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
    
    get date1Value(){
      return this.verificationForm.get("date1")
    }
    get date2Value(){
      return this.verificationForm.get("date2")
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