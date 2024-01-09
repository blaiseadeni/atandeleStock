import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SocieteService } from '../../services/societe.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-societe',
  templateUrl: './societe.component.html',
  styleUrls: ['./societe.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class SocieteComponent {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  societe: any = [];
  societes: any = {};
  
  societeDialog: boolean = false;
  societeForm: FormGroup;
  
  utilisateurId: any;
  
  constructor(
    private service: SocieteService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private jwtHelper: JwtHelperService
    ) { }
    
    ngOnInit(): void {
      this.societeForm = new FormGroup({
        denomination: new FormControl('', Validators.required),
        telephone: new FormControl('', Validators.required),
        addresse: new FormControl('', Validators.required),
        ville: new FormControl('',Validators.required),
        idNat:  new FormControl('',Validators.required),
        rccm: new FormControl('', Validators.required),
        tva: new FormControl('', Validators.required),
        monnaie: new FormControl('', Validators.required),
      });
      this.getAll();
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.societes = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.societeForm.valid)
      {
        if(this.societe.id){
          this.update();
          this.societeDialog = false;
        }else{
          this.add();
          this.societeDialog = false;
        }
      } else {
        this.validateAllFields(this.societeForm);
      }
      
    }
    
    add() {
      const request = {
        denomination: this.denominationValue.value,
        telephone: this.telephoneValue.value,
        addresse: this.addresseValue.value,
        ville: this.villeValue.value,
        idNat: this.idNatValue.value,
        rccm: this.rccmValue.value,
        tva: this.tvaValue.value,
        monnaie: this.monnaieValue.value,
        utilisateurId: this.utilisateurId
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
        denomination: this.denominationValue.value,
        telephone: this.telephoneValue.value,
        addresse: this.addresseValue.value,
        ville: this.villeValue.value,
        idNat: this.idNatValue.value,
        rccm: this.rccmValue.value,
        tva: this.tvaValue.value,
        monnaie: this.monnaieValue.value,
        utilisateurId: this.utilisateurId
        
      }
      
      this.service.update(this.societe.id, request)
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
          this.societe = response;
          this.societeForm.get("denomination")?.patchValue(this.societe.denomination);
          this.societeForm.get("telephone")?.patchValue(this.societe.telephone);
          this.societeForm.get("addresse")?.patchValue(this.societe.addresse);
          this.societeForm.get("ville")?.patchValue(this.societe.ville);
          this.societeForm.get("idNat")?.patchValue(this.societe.idNat);
          this.societeForm.get("rccm")?.patchValue(this.societe.rccm);
          this.societeForm.get("tva")?.patchValue(this.societe.tva);
          this.societeForm.get("monnaie")?.patchValue(this.societe.monnaie);
          this.societeDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.societeForm = this.fb.group({
        denomination: [],
        telephone: [],
        addresse: [],
        ville: [],
        idNat: [],
        rccm: [],
        tva: [],
        monnaie: [],
      });
      this.societe = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.societe = response;
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
      this.societeDialog = true;
    }
    
    fermerDialog() {
      this.societeDialog = false;
    }
    
    get denominationValue(){
      return this.societeForm.get("denomination")
    }
    
    get telephoneValue(){
      return this.societeForm.get("telephone")
    }
    
    get addresseValue(){
      return this.societeForm.get("addresse")
    }
    
    get villeValue(){
      return this.societeForm.get("ville")
    }
    
    get idNatValue(){
      return this.societeForm.get("idNat")
    }
    
    get rccmValue(){
      return this.societeForm.get("rccm")
    }
    
    get tvaValue(){
      return this.societeForm.get("tva")
    }
    
    get monnaieValue(){
      return this.societeForm.get("monnaie")
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
  