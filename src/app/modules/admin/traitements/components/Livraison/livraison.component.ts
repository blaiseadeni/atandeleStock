import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { LivraisonService } from '../../services/livraison.service';
import { LocationService } from '../../../fichiers/services/location.service';
import { ArticleService } from '../../../fichiers/services/article.service';

@Component({
  selector: 'app-annulation-rappro',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class LivraisonComponent implements OnInit {
  
  cols: any = [];
  livraisonForm: FormGroup;
  
  livraisons: any = [];
  livraison: any = {};
  commandes: any = [];
  locations: any = [];
  articles: any = [];
  
  fournisseurId: any;
  monnaieId: any;
  locationId: any;
  quantiteReste: any;
  
  commandedetail !: FormArray<any>;
  commandeproduct !: FormGroup<any>;
  
  constructor(
    private fb: FormBuilder,
    private service: LivraisonService,
    private commandeService: CommandeService,
    private locationService: LocationService,
    private articleService: ArticleService,
    private messageService: MessageService,
    ) { }
    
    ngOnInit(): void {
      this.livraisonForm = new FormGroup({
        numeroLivraison: new FormControl('', Validators.required),
        numeroCommande: new FormControl('', Validators.required),
        dateLivraison: new FormControl({value:'',disabled:true}, Validators.required),
        fournisseur: new FormControl({ value: '', disabled: true}, Validators.required),
        locationId: new FormControl('', Validators.required),
        monnaieId: new FormControl({ value: '', disabled: true}, Validators.required),
        observation: new FormControl(''),
        totalLivraison: new FormControl({value:0,disabled:true}),
        livraisonDetails: this.fb.array([]),
      });
      this.getAllCommandes();
      this.getAllLocations();
    }
    
    getAllCommandes() {
      this.commandeService.getAll()
      .subscribe({
        next: (response) => {
          this.commandes = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getCommande(event: any) {
      // console.log(event.value);
      this.fournisseurId = event.value.fournisseurId;
      this.monnaieId = event.value.monnaieId;
      this.articles = event.value.detailCommandes;
      this.livraisonForm.get("dateLivraison")?.patchValue(event.value.dateLivraison );
      this.livraisonForm.get("fournisseur")?.patchValue(event.value.fournisseur );
      this.livraisonForm.get("monnaieId")?.patchValue(event.value.monnaie );
    }
    
    getCommandeDetails(event: any, index: any) {
      //  console.log(event.value);
      this.commandedetail = this.livraisonForm.get("livraisonDetails") as FormArray;
      this.commandeproduct = this.commandedetail.at(index) as FormGroup;
      this.commandeproduct.get("quantite")?.patchValue(event.value.quantite);
      this.commandeproduct.get("emballage")?.patchValue(event.value.emballage);
      this.commandeproduct.get("quantiteLivree")?.patchValue(event.value.quantiteLivree);
      this.quantiteReste =this.commandeproduct.get("resteQuantite")?.patchValue(event.value.quantite - event.value.quantiteLivree);
      this.commandeproduct.get("prixUnit")?.patchValue(event.value.prixUnit);
      this.commandeproduct.get("prixTotal")?.patchValue(event.value.prixTotal);
      this.calculation(index);
    }
    
    //verification de la quatite
    verify(index: any) {
      const livre = this.newRowsList.at(index).get('livraisonActu')?.value;
      if (this.quantiteReste < livre) {
        this.newRowsList.at(index).get('livraisonActu')?.patchValue(0);
        this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: ' Qté livrée est superieur à la Qté commandée', life: 3000 });
      } else {
        this.calculation(index);
      }
    }
    calculation(index: any) {
      const subTotal = (this.newRowsList.at(index).get('prixUnit')?.value || 0) *
      (this.newRowsList.at(index).get('livraisonActu')?.value || 0);
      this.newRowsList.at(index).get('prixTotal')?.patchValue(subTotal);
      const Tot = this.newRowsList.value.reduce((acc: any, curr: any) => {
        acc += (curr.prixUnit || 0) * (curr.quantite || 0);
        return acc;
      }, 0);
      const tv = this.newRowsList.value.reduce((acc: any, curr: any) => {
        acc += (curr.tva || 0);
        return acc;
      }, 0);
      
      this.livraisonForm.get("prixTotal")?.patchValue(Tot);
      this.summarycalculation();
      this.Cheik();
    }
    
    summarycalculation() {
      let array = this.livraisonForm.getRawValue().livraisonDetails;
      let sumtotal = 0;
      array.forEach((x: any) => {
        sumtotal = sumtotal + x.prixTotal;
      });
      
      this.livraisonForm.get("totalLivraison")?.patchValue(sumtotal);
    }
    
    
    getAllLocations() {
      this.locationService.getAll()
      .subscribe({
        next: (response) => {
          this.locations = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    //Debut ajout d'une nouvelle ligne dans un formArray
    private createNewRows(): FormGroup {
      return this.fb.group({
        articleId: new FormControl('', Validators.required),
        emballage: new FormControl({value:'',disabled:true}, Validators.required),
        quantite: new FormControl({value:0,disabled:true}, Validators.required),
        quantiteLivree: new FormControl({value:0,disabled:true}, Validators.required),
        livraisonActu: new FormControl(0, Validators.required),
        resteQuantite: new FormControl({value:0,disabled:true}, Validators.required),
        prixUnit: new FormControl({value:0, disabled:true}, Validators.required),
        prixTotal: new FormControl({value:0, disabled: true}, Validators.required),
      });
    }
    
    public get newRowsList(): FormArray {
      return <FormArray>this.livraisonForm.get('livraisonDetails');
    }
    
    public addNewRows(): void {
      this.newRowsList.push(this.createNewRows());
    }
    //Fin ajout d'une nouvelle ligne dans un formArray
    
    //retirer une ligne
    Remove(index: any) {
      this.newRowsList.removeAt(index);
    }
    save() {
      if (this.livraisonForm.valid)
      {
        if(this.livraison.id){
          this.update();
        }else{
          this.add();
        }
      } else {
        this.validateAllFields(this.livraisonForm);
      }
      
    }
    add() {
      const detail: any = [];
      this.newRowsList.controls.forEach((v) => {
        const items = {
          articleId: v.value.articleId.articleId,
          article: v.value.articleId.article,
          emballage: v.value.articleId.emballage,
          quantite: v.value.livraisonActu,
          prixUnit: v.value.articleId.prixUnit,
          prixTotal: v.value.livraisonActu * v.value.articleId.prixUnit,
        }
        detail.push(items);
      })
      const request = {
        numeroLivraison: this.numeroLivraisonValue.value,
        numeroCommande: this.numeroCommandeValue.value.numeroCommande,
        dateLivraison: this.dateLivraisonValue.value,
        fournisseurId: this.fournisseurId,
        observation: this.observationValue.value,
        locationId: this.locationIdValue.value.id,
        monnaieId: this.monnaieId,
        detailLivraisons:  detail,
        
      }
      const value = JSON.stringify(request)
      // console.log(request);
      this.service.add(value)
      .subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: 'Enregistrer avec succès', life: 3000 });
          this.reset();
        }
      });
    }
    
    update() {
      const detail: any = [];
      this.newRowsList.controls.forEach((v) => {
        const items = {
          articleId: v.value.articleId.id,
          article: v.value.articleId.designation,
          emballage: v.value.emballage.libelle,
          quantite: v.value.livraisonActu,
          prixUnit: v.value.prixUnit,
          numeroCommande: v.value.numeroCommande,
          prixTotal: v.value.livraisonActu * v.value.prixUnit,
        }
        detail.push(items);
      })
      
      const request = {
        numeroLivraison: this.numeroLivraisonValue.value,
        numeroCommande: this.numeroCommandeValue.value,
        dateLivraison: this.dateLivraisonValue.value,
        fournisseurId: this.fournisseurId,
        observation: this.observationValue.value,
        locationId: this.locationId,
        monnaieId: this.monnaieId,
        detailLivraisons:  detail,
        
      }
      const value = JSON.stringify(request)
      this.service.update(this.livraison.id, value)
      .subscribe({
        next: (response) => {
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: ' Modifier avec succès', life: 3000 });
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: 'Modifier avec succès', life: 3000 });
          this.reset();
        }
      })
    }
    
    Cheik() {
      const myFormArray = this.livraisonForm.get('livraisonDetails') as FormArray;
      myFormArray.valueChanges.subscribe(values => {
        // Iterate through the FormArray using a for loop
        for (let i = 0; i < myFormArray.length; i++) {
          for (let j = i + 1; j < myFormArray.length; j++) {
            // Compare each item to the others in the array
            if (values[i].articleId === values[j].articleId && values[i].emballage === values[j].emballage) {
              // Do something if a duplicate is found
              this.commandedetail = this.livraisonForm.get("livraisonDetails") as FormArray;
              this.commandeproduct = this.commandedetail.at(j) as FormGroup;
              // this.commandeproduct.get("quantite")?.patchValue("");
              //  alert('Duplicate found!');
              this.Remove(i);
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Article déjà selectionner !', life: 3000 });
            }
          }
        }
      });
    }
    
    reset() {
      this.livraisonForm =  this.fb.group({
        numeroLivraison: [],
        numeroCommande: [],
        dateLivraison: [],
        fournisseur: [],
        locationId: [],
        monnaieId: [],
        observation: [],
        totalLivraison: [],
        livraisonDetails: this.fb.array([]),
      });
    }
    
    
    get numeroLivraisonValue(){
      return this.livraisonForm.get("numeroLivraison");
    }
    get numeroCommandeValue(){
      return this.livraisonForm.get("numeroCommande");
    }
    get dateLivraisonValue(){
      return this.livraisonForm.get("dateLivraison");
    }
    get fournisseurValue(){
      return this.livraisonForm.get("fournisseur");
    }
    get locationIdValue(){
      return this.livraisonForm.get("locationId");
    }
    get monnaieIdValue(){
      return this.livraisonForm.get("monnaieId");
    }
    get observationValue(){
      return this.livraisonForm.get("observation");
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
  