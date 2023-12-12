import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PortefeuilleService } from '../../services/portefeuille.service';
import { MonnaieService } from '../../services/monnaie.service';
import { SignaletiqueService } from '../../services/signaletique.service';

@Component({
  selector: 'app-portefeuille',
  templateUrl: './portefeuille.component.html',
  styleUrls: ['./portefeuille.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PortefeuilleComponent {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  portefeuille: any = {};
  portefeuilles: any = [];
  monnaies: any = [];
  clients: any = [];
  
  portefeuilleDialog: boolean = false;
  portefeuilleForm 
  
  constructor(
    private messageService: MessageService,
    private service: PortefeuilleService,
    private monaieservice: MonnaieService,
    private clientservice: SignaletiqueService
    ) {}
    
    
    ngOnInit(): void {
      this.portefeuilleForm = new FormGroup({
        clientId: new FormControl('', Validators.required),
        monnaieId: new FormControl('', Validators.required),
        montant: new FormControl('', Validators.required),
      });
      this.getAll();
      this.getAllClients();
      this.getAllMonnais();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.portefeuilles = response; 
          
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllClients() {
      this.clientservice.getAll()
      .subscribe({
        next: (response) => {
          this.clients = response; 
          
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllMonnais() {
      this.monaieservice.getAll()
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
      if (this.portefeuilleForm.valid)
      {
        if(this.portefeuille.id){
          this.update();
          this.portefeuilleDialog = false;
        }else{
          this.add();
          this.portefeuilleDialog = false;
        }
      } else {
        this.validateAllFields(this.portefeuilleForm);
      }
      
    }
    
    add() {
      const request = {
        clientId: this.clientIdValue.value.id,
        monnaieId: this.monnaieIdValue.value.id,
        montant: this.montantValue.value,
        
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
        clientId: this.clientIdValue.value.id,
        monnaieId: this.monnaieIdValue.value.id,
        montant: this.montantValue.value,
        
      }
      
      this.service.update(this.portefeuille.id, request)
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
          this.portefeuille = response;
          this.portefeuilleForm.get("clientId")?.patchValue(this.portefeuille.clientId);
          this.portefeuilleForm.get("monnaieId")?.patchValue(this.portefeuille.monnaieId);
          this.portefeuilleForm.get("montant")?.patchValue(this.portefeuille.montant);
          this.portefeuilleDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.portefeuilleForm.get("clientId")?.patchValue('');
      this.portefeuilleForm.get("monnaieId")?.patchValue('');
      this.portefeuilleForm.get("addresse")?.patchValue('');
      this.portefeuille = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.portefeuille = response;
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
      this.portefeuilleDialog = true;
    }
    
    fermerDialog() {
      this.portefeuilleDialog = false;
    }
    
    get clientIdValue(){
      return this.portefeuilleForm.get("clientId");
    }
    
    get monnaieIdValue(){
      return this.portefeuilleForm.get("monnaieId");
    }
    
    get montantValue(){
      return this.portefeuilleForm.get("montant");
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
  