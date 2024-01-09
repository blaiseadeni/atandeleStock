import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InventaireExtraService } from '../../services/inventaire-extra.service';
import { ArticleService } from '../../../fichiers/services/article.service';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class InventaireComponent {
  cols: any = [];
  inventaireDialog: boolean = false;
  printInventaireDialog: boolean = false;
  inventaireForm: FormGroup;
  printInventaireForm: FormGroup;
  utilisateurId: any;
  locationId: any;
  inventaire: any = {};
  invent: any = {};
  inventaires: any = [];
  articles: any = [];
  date1: any;
  date2: any;
  /**
  *
  */
  constructor(
    private jwtHelper: JwtHelperService,
    private service: InventaireExtraService,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private messageService: MessageService,
    ) {
      
    }
    ngOnInit(): void {
      this.inventaireForm = new FormGroup({
        articleId: new FormControl('', Validators.required),
        quantitePhysique: new FormControl('', Validators.required),
        quantiteLogique: new FormControl({value:0, disabled:true}, Validators.required),
        ecart: new FormControl({value:0, disabled:true}, Validators.required),
      });
      
      this.printInventaireForm = new FormGroup({
        date1: new FormControl('', Validators.required),
        date2: new FormControl('', Validators.required),
      });
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      
      this.getAll();
      this.getAllArts();
      
    }
    
    getAllArts() {
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
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.inventaires = response;
          console.log(this.inventaires);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getInventaire(event: any) {
      const request = {
        articleId: event.value.id,
        locationId:this.locationId
      }
      // console.log(request);
      this.inventaire = {};
      this.inventaireForm.get("quantiteLogique")?.patchValue(0);
      this.inventaireForm .get("quantitePhysique")?.patchValue(0);
      this.service.getInvent(request)
      .subscribe({
        next: (response) => {
          this.invent = response;
          // console.log(this.invent);
          // this.date1 = this.invent.date;
          // this.date2 = this.invent.date1;
          // console.log(this.date1,this.date2);
          this.inventaireForm.get("quantiteLogique")?.patchValue(this.invent.quantite);
          // console.log(this.inventaire);
          
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    add() {
      const request = {
        utilisateurId: this.utilisateurId,
        locationId: this.locationId,
        ecart: this.ecartValue.value,
        quantitePhysique: this.quantitePhysiqueValue.value,
        quantiteLogique: this.quantiteLogiqueValue.value,
        articleId: this.articleIdValue.value.id,
        date1: this.date1,
        date2:this.date2
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
    
    
    
    update() {
      const request = {
        utilisateurId: this.utilisateurId,
        locationId: this.locationId,
        ecart: this.ecartValue.value,
        quantitePhysique: this.quantitePhysiqueValue.value,
        quantiteLogique: this.quantiteLogiqueValue.value,
        articleId: this.articleIdValue.value.id,
      }
      
      this.service.update(this.inventaire.id, request)
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
    
    save() {
      if (this.inventaireForm.valid)
      {
        if(this.inventaire.id){
          this.update();
          this.inventaireDialog = false;
        }else{
          this.add();
          this.inventaireDialog = false;
        }
      } else {
        this.validateAllFields(this.inventaireForm);
      }
      
    }
    
    printDoc() {
      if (this.printInventaireForm.valid)
      {
        this.print();
      } else {
        this.validateAllFields(this.printInventaireForm);
      }
      
    }
    
    print() {
      const request = {
        locationId: this.locationId,
        date1: this.date1Value.value,
        date2:this.date2Value.value
      }
      const value = JSON.stringify(request);
      console.log(value);
      
      this.service.PrintFIS(value).subscribe(res => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        window.open(url);
        this.printInventaireDialog = false;
      });
    }
    
    calculation() {
      let ecart = this.quantiteLogiqueValue.value - this.quantitePhysiqueValue.value;
      this.inventaireForm .get("ecart")?.patchValue(ecart);
    }
    reset() {
      this.inventaireForm = this.fb.group({
        articleId: [],
        quantitePhysique: [],
        quantiteLogique: [],
        ecart: [],
      });
      this.inventaire = {};
    }
    
    ouvrirDialog() {
      this.inventaireDialog = true;
    }
    
    fermerDialog() {
      this.inventaireDialog = false;
    }
    
    ouvrirPrintDialog() {
      this.printInventaireDialog = true;
    }
    
    fermerPrintDialog() {
      this.printInventaireDialog = false;
    }
    
    
    get quantitePhysiqueValue(){
      return this.inventaireForm.get("quantitePhysique");
    }
    
    get quantiteLogiqueValue(){
      return this.inventaireForm.get("quantiteLogique");
    }
    
    get ecartValue(){
      return this.inventaireForm.get("ecart");
    }
    get articleIdValue(){
      return this.inventaireForm.get("articleId");
    }
    
    get date1Value(){
      return this.printInventaireForm.get("date1");
    }
    get date2Value(){
      return this.printInventaireForm.get("date2");
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
  