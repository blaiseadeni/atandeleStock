import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { SignaletiqueService } from '../../services/signaletique.service';
import { Table } from 'primeng/table';
import { MonnaieService } from '../../services/monnaie.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-control-opera',
  templateUrl: './signaletique.component.html',
  styleUrls: ['./signaletique.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SignaletiqueComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  items: any = [];
  
  signaletique: any = {};
  signaletiques: any = [];
  
  signaletiqueDialog: boolean = false;
  signaletiqueForm : FormGroup;
  
  utilisateurId: any;
  locationId: any;
  role: any;
  
  constructor(
    private messageService: MessageService,
    private service: SignaletiqueService,
    private jwtHelper: JwtHelperService
    
    ) {}
    
    ngOnInit(): void {
      this.signaletiqueForm = new FormGroup({
        categorie: new FormControl('', Validators.required),
        nom : new FormControl('', Validators.required),
        telephone : new FormControl('',Validators.required),
        addresse : new FormControl('', Validators.required),
        // raisonSociale : new FormControl('', Validators.required),
        // email : new FormControl('', Validators.email),
      })
      
      this.items = [
        {name:'PERSONNE MORALE', value:'PERSONNE MORALE'},
        {name:'PERSONNE PHYSIQUE', value:'PERSONNE PHYSIQUE'},
      ]
      
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
          this.signaletiques = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.signaletiqueForm.valid)
      {
        if(this.signaletique.id){
          this.update();
          this.signaletiqueDialog = false;
        }else{
          this.add();
          this.signaletiqueDialog = false;
        }
      } else {
        this.validateAllFields(this.signaletiqueForm);
      }
      
    }
    
    add() {
      const request = {
        nom: this.nomValue.value,
        telephone: this.telephoneValue.value,
        addresse: this.addresseValue.value,
        categorie: this.categorieValue.value.value,
        // raisonSociale: this.raisonSocialeValue.value,
        // email: this.emailValue.value,
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
        addresse: this.addresseValue.value,
        categorie: this.categorieValue.value.value,
        // raisonSociale: this.raisonSocialeValue.value,
        // email: this.emailValue.value,
        utilisateurId: this.utilisateurId
        
      }
      
      this.service.update(this.signaletique.id, request)
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
          this.signaletique = response;
          this.signaletiqueForm.get("nom")?.patchValue(this.signaletique.nom);
          this.signaletiqueForm.get("telephone")?.patchValue(this.signaletique.telephone);
          this.signaletiqueForm.get("addresse")?.patchValue(this.signaletique.addresse);
          this.signaletiqueForm.get("categorie")?.patchValue(this.signaletique.categorie);
          // this.signaletiqueForm.get("raisonSociale")?.patchValue(this.signaletique.raisonSociale);
          // this.signaletiqueForm.get("email")?.patchValue(this.signaletique.email);
          this.signaletiqueDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.signaletiqueForm.get("nom")?.patchValue('');
      this.signaletiqueForm.get("telephone")?.patchValue('');
      this.signaletiqueForm.get("addresse")?.patchValue('');
      this.signaletiqueForm.get("categorie")?.patchValue('');
      // this.signaletiqueForm.get("raisonSociale")?.patchValue('');
      // this.signaletiqueForm.get("email")?.patchValue('');
      this.signaletique = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.signaletique = response;
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
      this.signaletiqueDialog = true;
    }
    
    fermerDialog() {
      this.signaletiqueDialog = false;
    }
    
    get categorieValue(){
      return this.signaletiqueForm.get("categorie");
    }
    
    get nomValue(){
      return this.signaletiqueForm.get("nom");
    }
    get telephoneValue(){
      return this.signaletiqueForm.get("telephone");
    }
    get addresseValue(){
      return this.signaletiqueForm.get("addresse");
    }
    // get emailValue(){
    //   return this.signaletiqueForm.get("email");
    // }
    
    // get raisonSocialeValue(){
    //   return this.signaletiqueForm.get("raisonSociale");
    // }
    
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
  