import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';
import { Table } from 'primeng/table';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FournisseurComponent {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  fournisseur: any = {};
  fournisseurs: any = [];
  
  fournisseurDialog: boolean = false;
  fournisseurForm: FormGroup;
  
  utilisateurId: any;
  locationId: any;
  
  constructor(
    private messageService: MessageService,
    private service: FournisseurService,
    private jwtHelper: JwtHelperService
    ) {}
    
    ngOnInit(): void {
      this.fournisseurForm = new FormGroup({
        nom: new FormControl('', Validators.required),
        telephone: new FormControl('', Validators.required),
        adresse: new FormControl('', Validators.required),
        ville: new FormControl('', Validators.required),
      });
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      this.getAll();
    }
    
    getAll() {
      this.service.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.fournisseurs = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.fournisseurForm.valid)
      {
        if(this.fournisseur.id){
          this.update();
          this.fournisseurDialog = false;
        }else{
          this.add();
          this.fournisseurDialog = false;
        }
      } else {
        this.validateAllFields(this.fournisseurForm);
      }
      
    }
    
    add() {
      const request = {
        nom: this.nomValue.value,
        telephone: this.telephoneValue.value,
        adresse: this.adresseValue.value,
        ville: this.villeValue.value,
        utilisateurId: this.utilisateurId
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
        nom: this.nomValue.value,
        telephone: this.telephoneValue.value,
        adresse: this.adresseValue.value,
        ville: this.villeValue.value,
        utilisateurId: this.utilisateurId
      }
      
      this.service.update(this.fournisseur.id, request)
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
          this.fournisseur = response;
          this.fournisseurForm.get("nom")?.patchValue(this.fournisseur.nom);
          this.fournisseurForm.get("telephone")?.patchValue(this.fournisseur.telephone);
          this.fournisseurForm.get("adresse")?.patchValue(this.fournisseur.adresse);
          this.fournisseurForm.get("ville")?.patchValue(this.fournisseur.ville);
          this.fournisseurDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.fournisseurForm.get("nom")?.patchValue('');
      this.fournisseurForm.get("telephone")?.patchValue('');
      this.fournisseurForm.get("adresse")?.patchValue('');
      this.fournisseurForm.get("ville")?.patchValue('');
      this.fournisseur = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.fournisseur = response;
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
    
    get nomValue(){
      return this.fournisseurForm.get("nom");
    }
    get telephoneValue(){
      return this.fournisseurForm.get("telephone");
    }
    get adresseValue(){
      return this.fournisseurForm.get("adresse");
    }
    get villeValue(){
      return this.fournisseurForm.get("ville");
    }
    
    ouvrirDialog() {
      this.fournisseurDialog = true;
    }
    
    fermerDialog() {
      this.fournisseurDialog = false;
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
  