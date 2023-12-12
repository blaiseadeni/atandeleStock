import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AchatService } from '../../services/achat.service';
import { MonnaieService } from '../../../fichiers/services/monnaie.service';
import { FournisseurService } from '../../../fichiers/services/fournisseur.service';
import { LocationService } from '../../../fichiers/services/location.service';
import { EmballageService } from '../../../fichiers/services/emballage.service';
import { ArticleService } from '../../../fichiers/services/article.service';
import { EmballageByArticleService } from '../../services/emballage-by-article.service';

@Component({
  selector: 'app-controle-declare-tp',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AchatComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  
  achat: any = {};
  monnaies: any = [];
  fournisseurs: any = [];
  locations: any = [];
  articles: any = [];
  emballages: any = [];
  
  deleteDialog: boolean = false;
  achatForm: FormGroup;
  
  commandedetail !: FormArray<any>;
  commandeproduct !: FormGroup<any>;
  productDetails: any[] = [];
  
  emballageArt: any = [];
  monTableau: any = [];
  monTableau1: any = [];
  
  constructor(
    private fb: FormBuilder,
    private service: AchatService,
    private messageService: MessageService,
    private monnaieService: MonnaieService,
    private fournisseurService: FournisseurService,
    private locationsService: LocationService,
    private emballageService: EmballageService,
    private articleService: ArticleService,
    private emballageByartService:EmballageByArticleService,
    
    ) { }
    
    ngOnInit(): void {
      this.achatForm = new FormGroup({
        dateAchat: new FormControl('', Validators.required),
        numeroFacture: new FormControl('', Validators.required),
        monnaieId: new FormControl('', Validators.required),
        locationId: new FormControl('', Validators.required),
        fournisseurId: new FormControl('', Validators.required),
        tauxAchat: new FormControl('', Validators.required),
        montantTotal: new FormControl({value:0,disabled:true}, Validators.required),
        numeroAchat: new FormControl('', Validators.required),
        detailAchats: this.fb.array([]),
      });
      this.getAllArticles();
      this.getAllEmballages();
      this.getAllFournisseurs();
      this.getAllLocations();
      this.getAllMonnaie();
    }
    
    
    //Debut ajout d'une nouvelle ligne dans un formArray
    private createNewRows(): FormGroup {
      return this.fb.group({
        articleId: new FormControl('', Validators.required),
        emballage: new FormControl('', Validators.required),
        quantite: new FormControl('', Validators.required),
        prixUnit: new FormControl('', Validators.required),
        prixTotal: new FormControl({value:0,disabled:true}, Validators.required),
      });
    }
    
    public get newRowsList(): FormArray {
      return <FormArray>this.achatForm.get('detailAchats');
    }
    
    public addNewRows(): void {
      this.newRowsList.push(this.createNewRows());
    }
    //Fin ajout d'une nouvelle ligne dans un formArray
    
    //retirer une ligne
    Remove(index: any) {
      this.newRowsList.removeAt(index);
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
    
    getAllLocations() {
      this.locationsService.getAll()
      .subscribe({
        next: (response) => {
          this.locations = response;
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
      this.summarycalculation();
    }
    
    summarycalculation() {
      let array = this.achatForm.getRawValue().detailAchats;
      let sumtotal = 0;
      array.forEach((x: any) => {
        sumtotal = sumtotal + x.prixTotal;
      });
      
      this.achatForm.get("montantTotal")?.patchValue(sumtotal);
    }
    
    
    save() {
      if (this.achatForm.valid) {
        this.add();
      } else {
        this.validateAllFields(this.achatForm);
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
        dateAchat: this.dateAchatValue.value,
        numeroFacture: this.numeroFactureValue.value,
        monnaieId: this.monnaieIdValue.value.id,
        locationId: this.locationIdValue.value.id,
        fournisseurId: this.fournisseurIdValue.value.id,
        tauxAchat: this.tauxAchatValue.value,
        montantTotal: this.montantTotalValue.value,
        numeroAchat: this.numeroAchatValue.value,
        detailAchats:  detail,
        
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
    
    reset() {
      this.achatForm = this.fb.group({
        dateAchat: [],
        numeroFacture: [],
        monnaieId: [],
        locationId: [],
        fournisseurId: [],
        tauxAchat: [],
        montantTotal: [],
        numeroAchat: [],
        detailAchats: this.fb.array([]),
      });
    }
    
    Cheik() {
      const myFormArray = this.achatForm.get('detailAchats') as FormArray;
      myFormArray.valueChanges.subscribe(values => {
        // Iterate through the FormArray using a for loop
        for (let i = 0; i < myFormArray.length; i++) {
          for (let j = i + 1; j < myFormArray.length; j++) {
            // Compare each item to the others in the array
            if (values[i].articleId === values[j].articleId && values[i].emballage.libelle === values[j].emballage.libelle) {
              // Do something if a duplicate is found
              this.commandedetail = this.achatForm.get("detailAchats") as FormArray;
              this.commandeproduct = this.commandedetail.at(j) as FormGroup;
              // this.commandeproduct.get("quantite")?.patchValue("");
              // alert('Duplicate found!');
              // this.Remove(i);
              this.newRowsList.at(j).get('emballage')?.patchValue('');
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Cet achat a été déjà effectué !', life: 3000 });
            }
          }
        }
      });
    }
    
    get dateAchatValue() {
      return this.achatForm.get("dateAchat")
    }
    get numeroFactureValue() {
      return this.achatForm.get("numeroFacture")
    }
    get monnaieIdValue() {
      return this.achatForm.get("monnaieId")
    }
    get locationIdValue() {
      return this.achatForm.get("locationId")
    }
    get fournisseurIdValue() {
      return this.achatForm.get("fournisseurId")
    }
    get tauxAchatValue() {
      return this.achatForm.get("tauxAchat")
    }
    get montantTotalValue() {
      return this.achatForm.get("montantTotal")
    }
    get numeroAchatValue() {
      return this.achatForm.get("numeroAchat")
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
  