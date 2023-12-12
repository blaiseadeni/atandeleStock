import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { FactureService } from '../../services/facture.service';
import { SignaletiqueService } from '../../../fichiers/services/signaletique.service';
import { ArticleService } from '../../../fichiers/services/article.service';
import { EmballageService } from '../../../fichiers/services/emballage.service';
import { MonnaieService } from '../../../fichiers/services/monnaie.service';
import { PrixLocationService } from '../../services/prix-location.service';
import { PortefeuilleService } from '../../../fichiers/services/portefeuille.service';
import { EmballageByArticleService } from '../../services/emballage-by-article.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class FactureComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  factureForm: FormGroup;
  facture: any = {};
  modes: any = [];
  client: any;
  clientId: any;
  status: any;
  monnaies: any = [];
  clients: any = [];
  articles: any = [];
  emballages: any = [];
  estClient: boolean = false;
  prix: any = {};
  article: any = {};
  tableauPrix: any = [];
  tableauPrix1: any = [];
  tableauArticle: any = [];
  tableauArticle1: any = [];
  stock: any = {};
  result: any = {};
  qte: any = {};
  quatites: any = [];
  quatiteStock: any = [];
  portefeuille: any = {};
  montantPayer: any = {};
  commandedetail !: FormArray<any>;
  commandeproduct !: FormGroup<any>;
  
  cheikGros: boolean = false;
  avecPortefeuille: boolean = false;
  
  emballageArt: any = [];
  monTableau: any = [];
  monTableau1: any = [];
  emballageGros: any = [];
  
  reste: any;
  pu: any;
  pt: any;
  
  constructor(
    private fb: FormBuilder,
    private service: FactureService,
    private messageService: MessageService,
    private clientService: SignaletiqueService,
    private monnaieService: MonnaieService,
    private articleService: ArticleService,
    private emballageService: EmballageService,
    private prixService: PrixLocationService,
    private portefeuilleService:PortefeuilleService,
    private emballageByartService: EmballageByArticleService,
    private stockService:StockService
    ) { }
    
    ngOnInit(): void {
      this.factureForm = new FormGroup({
        numeroFacture: new FormControl(''),
        dateFacture: new FormControl(''),
        cleintId: new FormControl(''),
        acheteur: new FormControl('',),
        taux: new FormControl(0,),
        remise: new FormControl(0),
        totalHt: new FormControl({value:'',disabled:true}, Validators.required),
        resteAPayer: new FormControl({value:'',disabled:true}, Validators.required),
        montantPayer: new FormControl(0),
        montantAPayer: new FormControl({value:'',disabled:true}, Validators.required),
        monnaie: new FormControl('', Validators.required),
        paiement: new FormControl(''),
        status: new FormControl(''),
        mode: new FormControl('', Validators.required),
        montantPortefeuille: new FormControl(0),
        factureDetails: this.fb.array([]),
      });
      this.getAllClients();
      this.getAllMonnaie();   
      this.getAllArticles();
      this.getAllEmballages();
      
      this.modes = [
        {name:'CASH', value:'CASH'},
        {name:'CREDIT', value:'CREDIT'},
        {name:'PORTEFEUILLE', value:'PORTEFEUILLE'},
      ]
    }
    
    getAllEmballages() {
      this.emballageService.getAll()
      .subscribe({
        next: (response) => {
          this.emballages = response;
          // console.log(this.emballages);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllArticles() {
      this.prixService.getAll()
      .subscribe({
        next: (response) => {
          this.articles = response;
          //  console.log(this.articles);
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
    getAllClients() {
      this.clientService.getAll()
      .subscribe({
        next: (response) => {
          this.clients = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    //get montant du portaeuille 
    getMontant() {
      if (this.paiementValue.value.name === "PORTEFEUILLE") {
        
        this.portefeuilleService.get(this.clientId)
        .subscribe({
          next: (response) => {
            this.portefeuille = response;
            // console.log(this.portefeuille.montant);
            this.summarycalculation();
          },
          error: (errors) => {
            console.log(errors);
          }
        });
      } else {
        this.portefeuille = {};
        this.summarycalculation();
      };
      
      if (this.estClient === true && this.paiementValue.value.name === "PORTEFEUILLE") {
        this.avecPortefeuille = true;
      } else {
        this.avecPortefeuille = false;
        
      }
    }
    
    getPrixArticle(event: any, index: any) {
      //RECUPERTION DE PRIX DE CHAQUE ARTICLE
      this.tableauPrix = [];
      // console.log(event.value);
      this.prixService.get(event.value.id)
      .subscribe({
        next: (response) => {
          this.prix = response;
          // console.log(this.prix);
          this.tableauPrix.push(this.prix);
          this.tableauPrix1[index] = this.tableauPrix;
          // console.log(this.tableauPrix1);
          this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
          this.commandeproduct = this.commandedetail.at(index) as FormGroup;
          this.commandeproduct.get("prixUnit")?.patchValue('');
          this.commandeproduct.get("emballage")?.patchValue('');
          this.calculation(index);
          this.Cheik();
          
        },
        error: (errors) => {
          console.log(errors);
        }
      });
      
      //GET QTE STOCK
      this.stockService.get(event.value.articleId)
      .subscribe({
        next: (response) => {
          this.stock = response;
          // console.log(this.stock.quantite);
          this.quatiteStock.push(this.stock.quantite);
          // console.log(this.quatiteStock);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
      
      //RECUPERATION DES EMBALLAGES SELON CHAQUE ARTICLE
      this.monTableau = [];
      this.emballageByartService.get(event.value.articleId)
      .subscribe({
        next: (response) => {
          this.emballageArt = response;
          // console.log(this.emballageArt);
          const detail = { libelle: this.emballageArt.emballageDetail, }
          
          const gros =  {  libelle: this.emballageArt.emballageGros, };
          this.emballageGros.push(gros);
          this.monTableau.push(detail);
          this.monTableau.push(gros);
          this.monTableau1[index] = this.monTableau;
          // console.log(this.emballageGros);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
      
      //RECUPERATION D'ARTICLE
      this.tableauArticle = [];
      this.articleService.get(event.value.articleId)
      .subscribe({
        next: (response) => {
          this.article = response;
          // console.log(this.article.quantiteDetail);
          
          this.tableauArticle.push(this.article.quantiteDetail);
          this.tableauArticle1[index] = this.tableauArticle;
          // console.log(this.tableauArticle1);
          
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
        emballage: new FormControl('', Validators.required),
        quantite: new FormControl('', Validators.required),
        prixUnit: new FormControl({value:'',disabled:true}, Validators.required),
        prixTotal: new FormControl({value:'',disabled:true}, Validators.required),
      });
    }
    
    public get newRowsList(): FormArray {
      return <FormArray>this.factureForm.get('factureDetails');
    }
    
    public addNewRows(): void {
      this.newRowsList.push(this.createNewRows());
    }
    //Fin ajout d'une nouvelle ligne dans un formArray
    
    //retirer une ligne
    Remove(index: any) {
      this.newRowsList.removeAt(index);
      this.summarycalculation();
    }
    
    get numeroFactureValue(){
      return this.factureForm.get("numeroFacture");
    }
    get locationIdValue(){
      return this.factureForm.get("locationId");
    }
    get dateFactureValue(){
      return this.factureForm.get("dateFacture");
    }
    get clientValue(){
      return this.factureForm.get("cleintId");
    }
    get acheteurValue(){
      return this.factureForm.get("acheteur");
    }
    get tauxValue(){
      return this.factureForm.get("taux");
    }
    get remiseValue(){
      return this.factureForm.get("remise");
    }
    get totalHtValue(){
      return this.factureForm.get("totalHt");
    }
    get montantPayerValue(){
      return this.factureForm.get("montantPayer");
    }
    get resteApayerValue(){
      return this.factureForm.get("resteApayer");
    }
    get monnaieValue(){
      return this.factureForm.get("monnaie");
    }
    get paiementValue(){
      return this.factureForm.get("paiement");
    }
    get statusValue(){
      return this.factureForm.get("status");
    }
    
    get montantAPayerValue(){
      return this.factureForm.get("montantAPayer");
    }
    
    get montantPortefeuilleValue(){
      return this.factureForm.get("montantPortefeuille");
    }
    
    
    
    active(event: any) {
      this.portefeuille = {};
      this.summarycalculation();
      this.estClient = event.checked;
      if (this.estClient === true && this.paiementValue.value.name === "PORTEFEUILLE") {
        this.avecPortefeuille = true;
      } else {
        this.avecPortefeuille = false;
        
      }
      // console.log(this.estClient);
    }
    
    getClient(event:any) {
      this.clientId = event.value.id;
      // console.log(this.clientId);
      this.getMontant();
      
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
      this.pu = this.newRowsList.at(index).get('prixUnit')?.value;
      // this.cheikQte(index);
    }
    
    //Verification de la quaitite en stock et la qte com
    cheikQte(index: any) {
      const quantite = this.newRowsList.at(index).get('quantite')?.value;
      if (this.cheikGros == false) {
        if (this.quatiteStock[index] <= quantite) {
          // alert("La qte en stock est :" + this.quatiteStock[index])
          this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: ' La quantité en stock est de :'+this.quatiteStock[index], life: 5000 });
          this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
          this.commandeproduct = this.commandedetail.at(index) as FormGroup;
          this.commandeproduct.get("quantite")?.patchValue('');
        } else {
          // console.log(this.tableauPrix1[index]);
        }
      } else {
        const stock = this.quatiteStock[index];
        this.result = (stock / this.qte) - ((stock % this.qte)/this.qte); 
        if (this.result <= quantite) {
          this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: ' La quantité en stock est de :'+this.result, life: 5000 });
          this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
          this.commandeproduct = this.commandedetail.at(index) as FormGroup;
          this.commandeproduct.get("quantite")?.patchValue('');
        } else {
          
        }
      }
      this.calculation(index);
    }
    
    
    SelectEmballage(event: any, index: any) {
      let emballage = event.value.libelle
      if (this.emballageGros[index].libelle === emballage) {
        this.tableauPrix1[index].forEach(element => {
          this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
          this.commandeproduct = this.commandedetail.at(index) as FormGroup;
          this.commandeproduct.get("prixUnit")?.patchValue(element.prixVenteGros);
          this.commandeproduct.get("quantite")?.patchValue('');
          // console.log(element.prixVenteGros);
          this.cheikGros = true;
          this.tableauArticle1[index].forEach(element => {
            this.qte = element;
            
          });
        });
        
      } else {
        this.cheikGros = false;
        this.tableauPrix1[index].forEach(element => {
          this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
          this.commandeproduct = this.commandedetail.at(index) as FormGroup;
          this.commandeproduct.get("prixUnit")?.patchValue(element.prixVenteDetail);
          const quantite =  this.newRowsList.at(index).get('quantite')?.value;
          if (this.quatiteStock[index] <= quantite) {
            // alert("La qte en stock est :" + this.quatiteStock[index])
            this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: ' La quantité en stock est de :'+this.quatiteStock[index], life: 5000 });
            this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
            this.commandeproduct = this.commandedetail.at(index) as FormGroup;
            this.commandeproduct.get("quantite")?.patchValue('');
          } else {
            this.calculation(index);
          }
        });
      };
      this.calculation(index);
      this.summarycalculation();
    }
    
    
    summarycalculation() {
      if (this.portefeuille.montant > 0) {
        console.log(this.portefeuille.montant);
        let array = this.factureForm.getRawValue().factureDetails;
        let sumtotal = 0;
        let total = 0;
        array.forEach((x: any) => {
          sumtotal = sumtotal + x.prixTotal;
        });
        this.factureForm.get("totalHt")?.patchValue(sumtotal);
        this.factureForm.get("montantAPayer")?.patchValue(sumtotal - this.remiseValue.value);
        total = sumtotal - this.remiseValue.value - this.montantPortefeuilleValue.value;
        this.factureForm.get("resteAPayer")?.patchValue(total - this.montantPayerValue.value);
        this.reste = total - this.montantPayerValue.value - this.montantPortefeuilleValue.value;
        this.montantPayer = this.montantPortefeuilleValue.value;
      } else {
        let array = this.factureForm.getRawValue().factureDetails;
        let sumtotal = 0;
        let total = 0;
        array.forEach((x: any) => {
          sumtotal = sumtotal + x.prixTotal;
        });
        this.factureForm.get("totalHt")?.patchValue(sumtotal);
        this.factureForm.get("montantAPayer")?.patchValue(sumtotal - this.remiseValue.value);
        total = sumtotal - this.remiseValue.value;
        this.factureForm.get("resteAPayer")?.patchValue(total - this.montantPayerValue.value);
        this.reste = total - this.montantPayerValue.value;
        this.montantPayer = this.montantPayerValue.value;
      }
      
      if (this.portefeuille != null) {
        if (this.portefeuille.montant < this.montantPortefeuilleValue.value) {
          this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: 'Solde insufisant', life: 3000 });
          this.factureForm.get("montantPortefeuille")?.patchValue('');
        }
      } 
      
      if (this.reste < 0) {
        this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: 'Valeur invalide', life: 3000 });
        this.factureForm.get("montantPortefeuille")?.patchValue('');
        this.factureForm.get("montantPayer")?.patchValue('');
      } else {
        
      }
      
    }
    
    // save() {
    //   if (this.factureForm.valid)
    //   {
    //     this.add();
    //   } else {
    //     this.validateAllFields(this.factureForm);
    //   }
    
    // }
    
    save() {
      if (this.paiementValue.value.name === "CASH" && this.reste != 0) {
        this.messageService.add({ severity: 'error', summary: 'Averissement', detail: 'Vous avez choisi le mode de paiement cash, ce mode n\'autorise pas de reste ', life: 3000 });
        this.factureForm.get("montantPayer")?.patchValue('');
      } else {
        this.add();
      }
    }
    add() {
      if (this.estClient === true) {
        this.client = this.clientValue.value.id
      } else {
        this.client = this.acheteurValue.value
      };
      if (this.reste === 0) {
        this.status = "PAYER";
      } else {
        this.status = "NON PAYER";
        
      };
      const detail: any = [];
      this.newRowsList.controls.forEach((v) => {
        const items = {
          articleId: v.value.articleId.articleId,
          article: v.value.articleId.article,
          emballage: v.value.emballage.libelle,
          quantite: v.value.quantite,
          prixUnit: v.value.articleId.prixVenteDetail,
          prixTotal: v.value.articleId.prixVenteDetail * v.value.quantite
        }
        detail.push(items);
      })
      const request = {
        
        numeroFacture: this.numeroFactureValue.value,
        locationId: "273FB194-8142-4F64-9B09-08DBF01DCE18",
        client: this.client,
        taux: this.tauxValue.value,
        remise: this.remiseValue.value,
        totalHt: this.totalHtValue.value,
        montantPayer: this.montantPayer,
        resteApayer: this.reste,
        monnaie: this.monnaieValue.value.devise,
        paiement: this.paiementValue.value.value,
        status: this.status,
        montantPortefeuille: this.montantPortefeuilleValue.value,
        detailFactures:  detail,
        
      }
      const value = JSON.stringify(request)
      // console.log(value);
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
    
    Cheik() {
      const myFormArray = this.factureForm.get('factureDetails') as FormArray;
      myFormArray.valueChanges.subscribe(values => {
        // Iterate through the FormArray using a for loop
        for (let i = 0; i < myFormArray.length; i++) {
          for (let j = i + 1; j < myFormArray.length; j++) {
            // Compare each item to the others in the array
            if (values[i].articleId === values[j].articleId && values[i].emballage.libelle === values[j].emballage.libelle) {
              // Do something if a duplicate is found
              this.commandedetail = this.factureForm.get("factureDetails") as FormArray;
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
      this.factureForm = this.fb.group({
        numeroFacture: [],
        dateFacture: [],
        cleintId: [],
        acheteur: [],
        taux: [],
        remise: [],
        totalHt: [],
        resteAPayer: [],
        montantPayer: [],
        montantAPayer: [],
        monnaie: [],
        paiement: [],
        status: [],
        mode: [],
        factureDetails: this.fb.array([]),
      });
      
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
  