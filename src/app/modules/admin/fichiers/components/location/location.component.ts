import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { SocieteService } from '../../services/societe.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-code-activite',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class LocationComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  location: any = {};
  locations: any = [];
  societes: any = [];
  flag: boolean = false;
  
  locationDialog: boolean = false;
  locationForm: FormGroup;
  
  
  constructor(
    private service: LocationService,
    private societeService: SocieteService,
    private messageService: MessageService,
    ) { }
    
    ngOnInit(): void {
      this.locationForm = new FormGroup({
        designation: new FormControl('', Validators.required),
        dateCreation: new FormControl('', Validators.required),
        societeId: new FormControl('', Validators.required),
        dateCloture: new FormControl(''),
        flag: new FormControl(false),
        addresse: new FormControl('', Validators.required),
        numeroAchat: new FormControl('', Validators.required),
        numeroCommande: new FormControl('', Validators.required),
        numeroFacture: new FormControl('', Validators.required),
        numeroLivraison: new FormControl('', Validators.required),
      });
      this.getAll();
      this.getAllSociete();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.locations = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getAllSociete() {
      this.societeService.getAll()
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
      if (this.locationForm.valid)
      {
        if(this.location.id){
          this.update();
          this.locationDialog = false;
        }else{
          this.add();
          this.locationDialog = false;
        }
      } else {
        this.validateAllFields(this.locationForm);
      }
      
    }
    
    add() {
      const request = {
        designation: this.designationValue.value,
        dateCreation: this.dateCreationValue.value,
        societeId: this.societeIdValue.value.id,
        dateCloture: this.dateClotureValue.value,
        flag: this.flag,
        addresse: this.adresseValue.value,
        numeroAchat: this.numeroAchatValue.value,
        numeroCommande: this.numeroCommandeValue.value,
        numeroFacture: this.numeroFactureValue.value,
        numeroLivraison: this.numeroLivraisonValue.value,
        
      }
      if (request.dateCreation.getTime() > request.dateCloture.getTime()) {
        this.messageService.add({ severity: 'error', summary: 'Info', detail: 'Dates invalides', life: 3000 });
      } else {
        
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
    }
    
    update() {
      const request = {
        designation: this.designationValue.value,
        dateCreation: this.dateCreationValue.value,
        societeId: this.societeIdValue.value.id,
        dateCloture: this.dateClotureValue.value,
        flag: this.flag,
        addresse: this.adresseValue.value,
        numeroAchat: this.numeroAchatValue.value,
        numeroCommande: this.numeroCommandeValue.value,
        numeroFacture: this.numeroFactureValue.value,
        numeroLivraison: this.numeroLivraisonValue.value,
        
      }
      if (request.dateCreation.getTime() > request.dateCloture.getTime()) {
        this.messageService.add({ severity: 'error', summary: 'Info', detail: 'Dates invalides', life: 3000 });
      } else {
        
        this.service.update(this.location.id, request)
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
          this.location = response;
          this.locationForm.get("designation")?.patchValue(this.location.designation);
          this.locationForm.get("dateCreation")?.patchValue(this.location.dateCreation);
          this.locationForm.get("societeId")?.patchValue(this.location.societeId);
          this.locationForm.get("dateCloture")?.patchValue(this.location.dateCloture);
          this.locationForm.get("flag")?.patchValue(this.location.flag);
          this.locationForm.get("addresse")?.patchValue(this.location.addresse);
          this.locationForm.get("numeroAchat")?.patchValue(this.location.numeroAchat);
          this.locationForm.get("numeroCommande")?.patchValue(this.location.numeroCommande);
          this.locationForm.get("numeroFacture")?.patchValue(this.location.numeroFacture);
          this.locationForm.get("numeroLivraison")?.patchValue(this.location.numeroLivraison);
          this.locationDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.locationForm.get("designation")?.patchValue('');
      this.locationForm.get("dateCreation")?.patchValue('');
      this.locationForm.get("societeId")?.patchValue('');
      this.locationForm.get("dateCloture")?.patchValue('');
      this.locationForm.get("flag")?.patchValue('');
      this.locationForm.get("addresse")?.patchValue('');
      this.locationForm.get("numeroAchat")?.patchValue('');
      this.locationForm.get("numeroCommande")?.patchValue('');
      this.locationForm.get("numeroFacture")?.patchValue('');
      this.locationForm.get("numeroLivraison")?.patchValue('');
      this.location = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.location = response;
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
      this.locationDialog = true;
    }
    
    fermerDialog() {
      this.locationDialog = false;
    }
    
    get designationValue(){
      return this.locationForm.get("designation");
    }
    
    get dateCreationValue(){
      return this.locationForm.get("dateCreation");
    }
    
    get societeIdValue(){
      return this.locationForm.get("societeId");
    }
    
    get dateClotureValue(){
      return this.locationForm.get("dateCloture");
    }
    
    get adresseValue(){
      return this.locationForm.get("addresse");
    }
    
    get numeroAchatValue(){
      return this.locationForm.get("numeroAchat");
    }
    
    get numeroCommandeValue(){
      return this.locationForm.get("numeroCommande");
    }
    
    get numeroFactureValue(){
      return this.locationForm.get("numeroFacture");
    }
    
    get numeroLivraisonValue() {
      return this.locationForm.get("numeroLivraison");
    }
    
    active(event: any) {
      this.flag = event.checked;
      console.log(this.flag);
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
  