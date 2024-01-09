import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ArticleService } from '../../../fichiers/services/article.service';
import { ImpressionService } from '../../services/impression.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-impression',
  templateUrl: './impression.component.html',
  styleUrls: ['./impression.component.scss']
})
export class ImpressionComponent implements OnInit{
  critere: any;
  values: any = [];
  vente: boolean = false;
  stock: boolean = false;
  inventaire: boolean = false;
  venteForm: FormGroup;
  stockForm: FormGroup;
  resultatForm: FormGroup;
  stockDialog: boolean = false;
  venteDialog: boolean = false;
  inventDialog: boolean = false;
  articles: any = [];
  utilisateurId: any;
  locationId: any;
  url: any ;
  role: any ;
  button: boolean = false ;
  /**
  *
  */
  constructor(
    private jwtHelper: JwtHelperService,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private service:ImpressionService
    
    ) {
      
    }
    ngOnInit(): void {
      this.values = [
        { libelle: 'Fiche de vente', value: 'vente' },
        { libelle: 'Fiche de stock', value: 'stock' },
        { libelle: 'Fiche d\'inventaire', value: 'inventaire' },
      ];
      
      this.venteForm = new FormGroup({
        date1: new FormControl('', Validators.required),
        date2: new FormControl('', Validators.required),
      })
      
      this.stockForm = new FormGroup({
        articleId: new FormControl('', Validators.required),
        periode: new FormControl('', Validators.required),
      })
      
      this.resultatForm = new FormGroup({
        annee: new FormControl('', Validators.required),
      })
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      this.role = decodeJWT.role;
      this.getAllArts();
    }
    
    getcritere(event: any) {
      this.critere = event.value.value;
      if (this.critere === "vente") {
        this.vente = true;
        this.stock = false;
        this.inventaire = false;
      } else {
        if (this.critere === "stock") {
          this.vente = false;
          this.stock = true;
          this.inventaire = false;
        } else {
          if (this.critere === "inventaire") {
            this.vente = false;
            this.stock = false;
            this.inventaire = true;
          }
        }
      }
    }
    
    PrintFS1() {
      const request = {
        locationId: this.locationId,
        articleId: this.articleIdValue.value.id,
        periode: this.periodeValue.value
      }
      const value = JSON.stringify(request);
      console.log(value);
      this.service.PrintFS1(request)
      .subscribe({
        next: (response) => {
          let blob: Blob = response.body as Blob;
          this.url = window.URL.createObjectURL(blob);
          // console.log(response);
          this.stockDialog = false;
        },
        error: (e) => {
        }
      });
    }
    
    printVente() {
      const request = {
        locationId: this.locationId,
        date1: this.date1Value.value,
        date2:this.date2Value.value
      }
      // const value = JSON.stringify(request);
      // console.log(value);
      this.service.PrintVente(request)
      .subscribe({
        next: (response) => {
          let blob: Blob = response.body as Blob;
          this.url = window.URL.createObjectURL(blob);
          //  console.log(response);
          this.venteDialog = false;
        },
        error: (e) => {
        }
      });
    }
    
    printFIS() {
      const request = {
        locationId: this.locationId,
        date1: this.date1Value.value,
        date2:this.date2Value.value
      }
      // const value = JSON.stringify(request);
      // console.log(value);
      this.service.PrintFIS(request)
      .subscribe({
        next: (response) => {
          let blob: Blob = response.body as Blob;
          this.url = window.URL.createObjectURL(blob);
          // console.log(response);
          this.inventDialog = false;
        },
        error: (e) => {
        }
      });
    }
    
    
    PrintResultat() {
      if (this.resultatForm.valid) {
        this.service.PrintResultat(this.anneeValue.value).subscribe(res => {
          let blob: Blob = res.body as Blob;
          let url = window.URL.createObjectURL(blob);
          this.url = window.URL.createObjectURL(blob);
          //  window.open(url);
          // console.log(res);
        });
      } else {
        this.validateAllFields(this.resultatForm);
      }
      
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
    
    get anneeValue(){
      return this.resultatForm.get("annee");
    }
    
    get periodeValue(){
      return this.stockForm.get("periode");
    }
    
    get articleIdValue(){
      return this.stockForm.get("articleId");
    }
    
    get date1Value(){
      return this.venteForm.get("date1");
    }
    get date2Value(){
      return this.venteForm.get("date2");
    }
    
    
    showVenteDialog() {
      this.venteDialog = true;
    }
    
    hideVenteDialog() {
      this.venteDialog = false;
    }
    
    showStockDialog() {
      this.stockDialog = true;
    }
    
    hideStockDialog() {
      this.stockDialog = false;
    }
    
    showEventDialog() {
      this.inventDialog = true;
    }
    
    hideEventDialog() {
      this.inventDialog = false;
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
  