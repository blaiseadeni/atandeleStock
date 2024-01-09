import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PrixLocationService } from '../../services/prix-location.service';
import { ArticleService } from '../../../fichiers/services/article.service';
import { LocationService } from '../../../fichiers/services/location.service';
import { MonnaieService } from '../../../fichiers/services/monnaie.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-paiement-tp',
  templateUrl: './prix-article-location.component.html',
  styleUrls: ['./prix-article-location.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class PrixArticleLocationComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  prixLocation: any = {};
  prixLocations: any = [];
  articles: any = [];
  locations: any = [];
  monnaies: any = [];
  
  prixtDialog: boolean = false;
  prixForm: FormGroup;
  
  utilisateurId: any;
  locationId: any;
  
  constructor(
    private service: PrixLocationService,
    private articleService: ArticleService,
    private locationsService: LocationService,
    private monnaieService: MonnaieService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private jwtHelper:JwtHelperService
    ) { }
    
    ngOnInit(): void {
      this.prixForm = new FormGroup({
        prixVenteDetail: new FormControl('', Validators.required),
        prixVenteGros: new FormControl('', Validators.required),
        // locationId: new FormControl('', Validators.required),
        articleId: new FormControl('', Validators.required),
      });
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      
      this.getAll();
      this.getAllArticles();
      this.getAllLocations();
      this.getAllMonnaies();
    }
    
    getAll() {
      this.service.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.prixLocations = response;
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
    
    getAllMonnaies() {
      this.monnaieService.getAll()
      .subscribe({
        next: (response) => {
          this.monnaies = response;
          // console.log(this.monnaies);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    
    save() {
      if (this.prixForm.valid)
      {
        if(this.prixLocation.id){
          this.update();
          this.getAll();
        }else{
          this.add();
          this.getAll();
        }
      } else {
        this.validateAllFields(this.prixForm);
      }
      
    }
    
    add() {
      const request = {
        prixVenteDetail: this.prixVenteDetailValue.value,
        prixVenteGros: this.prixVenteGrosValue.value,
        locationId: this.locationId,
        articleId: this.articleIdValue.value.id,
        utilisateurId:this.utilisateurId
        
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
        prixVenteDetail: this.prixVenteDetailValue.value,
        prixVenteGros: this.prixVenteGrosValue.value,
        locationId: this.locationId,
        articleId: this.articleIdValue.value.id,
        utilisateurId:this.utilisateurId
        
      }
      
      this.service.update(this.prixLocation.id, request)
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
          this.prixLocation = response;
          this.prixForm.get("prixVenteDetail")?.patchValue(this.prixLocation.prixVenteDetail);
          this.prixForm.get("prixVenteGros")?.patchValue(this.prixLocation.prixVenteGros);
          // this.prixForm.get("monnaie")?.patchValue(this.prixLocation.monnaie);
          this.prixForm.get("locationId")?.patchValue(this.prixLocation.locationId);
          this.prixForm.get("articleId")?.patchValue(this.prixLocation.articleId);
          
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.prixForm =   this.fb.group({
        prixVenteDetail: [],
        prixVenteGros: [],
        monnaie: [],
        locationId: [],
        articleId:[],
      });
      this.prixLocation = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.prixLocation = response;
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
      this.prixtDialog = true;
    }
    
    fermerDialog() {
      this.prixtDialog = false;
    }
    
    get prixVenteDetailValue(){
      return this.prixForm.get("prixVenteDetail")
    }
    
    get prixVenteGrosValue(){
      return this.prixForm.get("prixVenteGros")
    }
    
    // get locationIdValue(){
    //   return this.prixForm.get("locationId")
    // }
    
    get articleIdValue(){
      return this.prixForm.get("articleId")
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
  