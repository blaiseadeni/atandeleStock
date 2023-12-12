import { CommandeService } from './../../services/commande.service';
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FournisseurService } from '../../../fichiers/services/fournisseur.service';
import { MonnaieService } from '../../../fichiers/services/monnaie.service';
import { ArticleService } from '../../../fichiers/services/article.service';
import { EmballageService } from '../../../fichiers/services/emballage.service';
import { EmballageByArticleService } from '../../services/emballage-by-article.service';

@Component({
  selector: 'app-calcul-penalite',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class CommandeComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  commande: any = {};
  commandes: any = [];
  monnaies: any = [];
  fournisseurs: any = [];
  articles: any = [];
  emballages: any = [];
  
  commandeForm: FormGroup;
  commandedetail !: FormArray<any>;
  commandeproduct !: FormGroup<any>;
  productDetails: any[] = [];
  
  monTableau: any = [];
  monTableau1: any = [];
  emballageArt: any = [];
  
  
  constructor(
    private fb: FormBuilder,
    private service: CommandeService,
    private messageService: MessageService,
    private fournisseurService: FournisseurService,
    private monnaieService: MonnaieService,
    private articleService: ArticleService,
    private emballageService: EmballageService,
    private emballageByartService:EmballageByArticleService,
    
    ) { }
    
    ngOnInit(): void {
      this.commandeForm = new FormGroup({
        numeroCommande: new FormControl('', Validators.required),
        dateCommande: new FormControl('', Validators.required),
        dateLivraison: new FormControl('', Validators.required),
        echeance: new FormControl('', Validators.required),
        fournisseurId: new FormControl('', Validators.required),
        observation: new FormControl(''),
        concerne: new FormControl('', Validators.required),
        totalCommande: new FormControl({ value: 0, disabled: true}, Validators.required),
        monnaieId: new FormControl('', Validators.required),
        tauxDeChange: new FormControl('', Validators.required),
        detailCommandes: this.fb.array([]),
      });
      this.getAllFournisseurs();
      this.getAllMonnaie();   
      this.getAllArticles();
      this.getAllEmballages();
    }
    
    
    getAllEmballages() {
      this.emballageService.getAll()
      .subscribe({
        next: (response) => {
          this.emballages = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllArticles() {
      this.articleService.getAll()
      .subscribe({
        next: (response) => {
          this.articles = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllMonnaie() {
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
    getAllFournisseurs() {
      this.fournisseurService.getAll()
      .subscribe({
        next: (response) => {
          this.fournisseurs = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    onChangeUnity(event: any, index: any) {
      this.monTableau = [];
      this.emballageByartService.get(event.value.id)
      .subscribe({
        next: (response) => {
          this.emballageArt = response;
          // console.log(this.emballageArt);
          const detail = 
          { libelle: this.emballageArt.emballageDetail, }
          
          const gros = 
          {  libelle: this.emballageArt.emballageGros, };
          
          this.monTableau.push(detail);
          this.monTableau.push(gros);
          console.log(this.monTableau1[index] = this.monTableau);
          
        },
        error: (errors) => {
          console.log(errors);
        }
      });
      this.Cheik();
    }
    calculation(index: any) {
      const subTotal = (this.newRowsList.at(index).get('prixUnit')?.value || 0) *
      (this.newRowsList.at(index).get('quantite')?.value || 0);
      this.newRowsList.at(index).get('prixTotal')?.patchValue(subTotal);
      const Tot = this.newRowsList.value.reduce((acc: any, curr: any) => {
        acc += (curr.prixUnit || 0) * (curr.quantite || 0);
        return acc;
      }, 0);
      const tv = this.newRowsList.value.reduce((acc: any, curr: any) => {
        acc += (curr.tva || 0);
        return acc;
      }, 0);
      
      this.commandeForm.get("prixTotal")?.patchValue(Tot);
      this.summarycalculation();
    }
    
    summarycalculation() {
      let array = this.commandeForm.getRawValue().detailCommandes;
      let sumtotal = 0;
      array.forEach((x: any) => {
        sumtotal = sumtotal + x.prixTotal;
      });
      
      this.commandeForm.get("totalCommande")?.patchValue(sumtotal);
    }
    
    
    //Debut ajout d'une nouvelle ligne dans un formArray
    private createNewRows(): FormGroup {
      return this.fb.group({
        articleId: new FormControl('', Validators.required),
        emballage: new FormControl('', Validators.required),
        quantite: new FormControl('', Validators.required),
        prixUnit: new FormControl('', Validators.required),
        prixTotal: new FormControl({ value: 0, disabled: true }, Validators.required),
      });
    }
    
    public get newRowsList(): FormArray {
      return <FormArray>this.commandeForm.get('detailCommandes');
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
      if (this.commandeForm.valid)
      {
        if(this.commande.id){
          this.update();
        }else{
          this.add();
        }
      } else {
        this.validateAllFields(this.commandeForm);
      }
      
    }
    add() {
      const detail: any = [];
      this.newRowsList.controls.forEach((v) => {
        const items = {
          articleId: v.value.articleId.id,
          article: v.value.articleId.designation,
          emballage: v.value.emballage.libelle,
          quantite: v.value.quantite,
          prixUnit: v.value.prixUnit,
          prixTotal: v.value.quantite * v.value.prixUnit,
        }
        detail.push(items);
      })
      const request = {
        numeroCommande : this.numeroCommandeValue.value,
        dateCommande: this.dateCommandeValue.value,
        dateLivraison: this.dateLivraisonValue.value,
        echeance: this.echeanceValue.value,
        fournisseurId: this.fournisseurValue.value.id,
        observation: this.observationValue.value,
        concerne: this.concerneValue.value,
        totalCommande: this.totalCommandeValue.value,
        monnaieId: this.monnaieIdValue.value.id,
        tauxDeChange: this.tauxDeChangeValue.value,
        detailCommandes:  detail,
        
      }
      const value = JSON.stringify(request)
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
          quantite: v.value.quantite,
          prixUnit: v.value.prixUnit,
          prixTotal: v.value.quantite * v.value.prixUnit,
        }
        detail.push(items);
      })
      
      const request = {
        numeroCommande : this.numeroCommandeValue.value,
        dateCommande: this.dateCommandeValue.value,
        dateLivraison: this.dateLivraisonValue.value,
        echeance: this.echeanceValue.value,
        fournisseurId: this.fournisseurValue.value.id,
        observation: this.observationValue.value,
        concerne: this.concerneValue.value,
        totalCommande: this.totalCommandeValue.value,
        monnaieId: this.monnaieIdValue.value.id,
        tauxDeChange: this.tauxDeChangeValue.value,
        detailCommandes:  detail,
        
      }
      const value = JSON.stringify(request)
      this.service.update(this.commande.id, value)
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
      const myFormArray = this.commandeForm.get('detailCommandes') as FormArray;
      myFormArray.valueChanges.subscribe(values => {
        // Iterate through the FormArray using a for loop
        for (let i = 0; i < myFormArray.length; i++) {
          for (let j = i + 1; j < myFormArray.length; j++) {
            // Compare each item to the others in the array
            if (values[i].articleId === values[j].articleId && values[i].emballage.libelle === values[j].emballage.libelle) {
              // Do something if a duplicate is found
              this.commandedetail = this.commandeForm.get("detailCommandes") as FormArray;
              this.commandeproduct = this.commandedetail.at(j) as FormGroup;
              // alert('Duplicate found!');
              // this.Remove(i);
              this.commandeproduct.get("emballage")?.patchValue("");
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Cette commande est déjà passée !', life: 3000 });
            }
          }
        }
      });
    }
    
    reset() {
      this.commandeForm = this.fb.group({
        numeroCommande:[],
        dateCommande: [],
        dateLivraison: [],
        echeance: [],
        fournisseurId: [],
        observation: [],
        concerne: [],
        totalCommande: [],
        monnaieId: [],
        tauxDeChange: [],
        detailCommandes: this.fb.array([]),
      });
      
    }
    get numeroCommandeValue() {
      return this.commandeForm.get("numeroCommande");
    }
    get dateCommandeValue() {
      return this.commandeForm.get("dateCommande");
    }
    get dateLivraisonValue() {
      return this.commandeForm.get("dateLivraison");
    }
    get echeanceValue() {
      return this.commandeForm.get("echeance");
    }
    get fournisseurValue() {
      return this.commandeForm.get("fournisseurId");
    }
    get observationValue() {
      return this.commandeForm.get("observation");
    }
    get concerneValue() {
      return this.commandeForm.get("concerne");
    }
    get totalCommandeValue() {
      return this.commandeForm.get("totalCommande");
    }
    get monnaieIdValue() {
      return this.commandeForm.get("monnaieId");
    }
    get tauxDeChangeValue() {
      return this.commandeForm.get("tauxDeChange");
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
  