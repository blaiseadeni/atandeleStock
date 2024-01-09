import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MonnaieService } from '../../services/monnaie.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-annul-mvt-comp',
  templateUrl: './monnaie.component.html',
  styleUrls: ['./monnaie.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class MonnaieComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  estLocal: boolean = false;
  deleteDialog: boolean = false;
  
  monnaie: any = {};
  monnaies: any = [];
  
  monnaieDialog: boolean = false;
  monnaieForm: FormGroup;
  
  utilisateurId: any;
  
  /**
  *
  */
  constructor(
    private service: MonnaieService,
    private messageService: MessageService,
    private jwtHelper: JwtHelperService
    ) {}
    
    ngOnInit(): void {
      this.monnaieForm = new FormGroup({
        devise : new FormControl('', Validators.required),
        libelle : new FormControl('', Validators.required),
      })
      this.getAll();
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
    }
    
    getAll() {
      this.service.getAll()
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
      if (this.monnaieForm.valid)
      {
        if(this.monnaie.id){
          this.update();
          this.monnaieDialog = false;
        }else{
          this.add();
          this.monnaieDialog = false;
        }
      } else {
        this.validateAllFields(this.monnaieForm);
      }
      
    }
    
    add() {
      const request = {
        libelle: this.libelleValue.value,
        devise: this.deviseValue.value,
        estLocal: this.estLocal,
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
        libelle: this.libelleValue.value,
        devise: this.deviseValue.value,
        estLocal: this.estLocal,
        utilisateurId: this.utilisateurId
        
      }
      
      this.service.update(this.monnaie.id, request)
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
          this.monnaie = response;
          this.monnaieForm.get("libelle")?.patchValue(this.monnaie.libelle);
          this.monnaieForm.get("devise")?.patchValue(this.monnaie.devise);
          this.monnaieDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.monnaieForm.get("libelle")?.patchValue('');
      this.monnaieForm.get("devise")?.patchValue('');
      this.monnaie = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.monnaie = response;
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
    
    locale(event: any) {
      this.estLocal = event.checked;
      console.log(this.estLocal);
    }
    
    
    ouvrirDialog() {
      this.monnaieDialog = true;
    }
    
    fermerDialog() {
      this.monnaieDialog = false;
    }
    
    get deviseValue(){
      return this.monnaieForm.get("devise");
    }
    
    get libelleValue(){
      return this.monnaieForm.get("libelle");
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
  