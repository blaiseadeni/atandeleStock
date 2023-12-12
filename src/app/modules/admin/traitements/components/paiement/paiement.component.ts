import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PaiementService } from '../../services/paiement.service';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class PaiementComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  paiementForm: FormGroup;
  
  factures: any = [];
  facture: any = {};
  paiement: any = {};
  paiements: any = [];
  
  constructor(
    private fb: FormBuilder,
    private service: PaiementService,
    private factureService: FactureService,
    private messageService: MessageService,
    ) { }
    
    
    ngOnInit(): void {
      this.paiementForm = new FormGroup({
        factureId: new FormControl(''),
        montantVerser: new FormControl('', Validators.required),
        montantPayer: new FormControl({value:'',disabled:true}),
        montant: new FormControl({value:'',disabled:true}),
        resteApayer: new FormControl({value:'',disabled:true}),
        numero: new FormControl('', Validators.required),
        remise: new FormControl({value:'',disabled:true}),
        
      });
      
      this.getAllFacture();
      this.getAll();
    }
    
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.paiements = response;
          console.log(this.paiements);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllFacture() {
      //  console.log(this.numeroValue.value);
      this.factureService.getAll()
      .subscribe({
        next: (response) => {
          this.factures = response;
          // console.log(this.factures);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getFacture(event: any) {
      // console.log(event.value.numeroFacture);
      this.factureService.getFacture(event.value.numeroFacture)
      .subscribe({
        next: (response) => {
          this.facture = response;
          // console.log(this.facture);
          this.paiementForm.get("montant")?.patchValue(this.facture.totalHt);
          this.paiementForm.get("montantPayer")?.patchValue(this.facture.montantPayer);
          this.paiementForm.get("resteApayer")?.patchValue(this.facture.resteApayer);
          this.paiementForm.get("remise")?.patchValue(this.facture.remise);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    get factureIdValue(){
      return this.paiementForm.get("numero");
    }
    
    get montantPayerValue(){
      return this.paiementForm.get("montantVerser");
    }
    
    
    save() {
      if (this.paiementForm.valid)
      {
        this.add();
      } else {
        this.validateAllFields(this.paiementForm);
      }
      
    }
    
    add() {
      const request = {
        factureId: this.factureIdValue.value.id,
        montantPayer: this.montantPayerValue.value
      }
      // console.log(request);
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
    
    // update() {
    //   const request = {
    //     familleId: this.familleIdValue.value.id,
    //     designation: this.designationValue.value,
    //     emballageGrosId: this.emballageGrosIdValue.value.id,
    //     emballageDetailId: this.emballageDetailIdValue.value.id,
    //     quantiteDetail: this.quantiteDetailValue.value,
    //     stockMinimal: this.stockMinimalValue.value
    
    //   }
    
    //   this.service.update(this.article.id, request)
    //   .subscribe({
    //     next: (response) => {
    //       this.getAll();
    //       this.reset();
    //     },
    //     complete: () => {
    //       this.messageService.add({ severity: 'success', summary: 'Modification', detail: ' Modifier avec succès', life: 3000 });
    //       this.getAll();
    //       this.reset();
    //     },
    //     error: (e) => {
    //       this.messageService.add({ severity: 'success', summary: 'Modification', detail: 'Modifier avec succès', life: 3000 });
    //       this.getAll();
    //       this.reset();
    //     }
    //   })
    // }
    
    delete(id: any) {
      this.service.delete(id)
      .subscribe({
        next: (response) => {
          //this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: ' Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
          // this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: 'Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
          //  this.reset();
        }
      });
    }
    
    // find(id:any):any {
    //   this.service.get(id)
    //   .subscribe({
    //     next: (response) => {
    //       this.article = response;
    //       this.articleForm.get("familleId")?.patchValue(this.article.familleId);
    //       this.articleForm.get("designation")?.patchValue(this.article.designation);
    //       this.articleForm.get("emballageGrosId")?.patchValue(this.article.emballageGrosId);
    //       this.articleForm.get("emballageDetailId")?.patchValue(this.article.emballageDetailId);
    //       this.articleForm.get("quantiteDetail")?.patchValue(this.article.quantiteDetail);
    //       this.articleForm.get("stockMinimal")?.patchValue(this.article.stockMinimal);
    
    //       this.articleDialog = true;
    //     },
    //     error: (response) => {
    //       console.log(response);
    //     }
    //   })
    // }
    
    reset() {
      this.paiementForm = this.fb.group({
        factureId: [],
        montantVerser: [],
        montantPayer: [],
        montant: [],
        resteApayer: [],
        numero: [],
        remise: [],
      });
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.paiement = response;
          this.deleteDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    hideSelect() {
      this.deleteDialog = false;
      // this.reset();
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
  