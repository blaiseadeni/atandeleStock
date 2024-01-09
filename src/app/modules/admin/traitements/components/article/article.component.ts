import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormControlDirective, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ArticleService } from '../../../fichiers/services/article.service';
import { EmballageService } from '../../../fichiers/services/emballage.service';
import { FamilleService } from '../../../fichiers/services/famille.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-declaration-tp',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class ArticleComponent implements OnInit {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  article: any = {};
  articles: any = [];
  emballages: any = [];
  familles: any = [];
  
  articleDialog: boolean = false;
  articleForm: FormGroup;
  
  utilisateurId: any;
  locationId: any;
  /**
  *
  */
  constructor(
    private service: ArticleService,
    private emballageService: EmballageService,
    private famillleService: FamilleService,
    private messageService: MessageService,
    private jwtHelper: JwtHelperService
    ) {
      
    }
    ngOnInit(): void {
      this.articleForm = new FormGroup({
        familleId: new FormControl('', Validators.required),
        designation: new FormControl('', Validators.required),
        emballageGrosId: new FormControl('', Validators.required),
        emballageDetailId: new FormControl('', Validators.required),
        quantiteDetail: new FormControl('', Validators.required),
        stockMinimal: new FormControl('', Validators.required),
      });
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      
      this.getAll();
      this.getAllEmballages();
      this.getAllFamilles();
      
      
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.articles = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllEmballages() {
      this.emballageService.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.emballages = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    getAllFamilles() {
      this.famillleService.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.familles = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.articleForm.valid)
      {
        if(this.article.id){
          this.update();
          this.articleDialog = false;
        }else{
          this.add();
          this.articleDialog = false;
        }
      } else {
        this.validateAllFields(this.articleForm);
      }
      
    }
    
    add() {
      const request = {
        familleId: this.familleIdValue.value.id,
        designation: this.designationValue.value,
        emballageGrosId: this.emballageGrosIdValue.value.id,
        emballageDetailId: this.emballageDetailIdValue.value.id,
        quantiteDetail: this.quantiteDetailValue.value,
        stockMinimal: this.stockMinimalValue.value,
        utilisateurId: this.utilisateurId
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
        familleId: this.familleIdValue.value.id,
        designation: this.designationValue.value,
        emballageGrosId: this.emballageGrosIdValue.value.id,
        emballageDetailId: this.emballageDetailIdValue.value.id,
        quantiteDetail: this.quantiteDetailValue.value,
        stockMinimal: this.stockMinimalValue.value,
        utilisateurId: this.utilisateurId
        
      }
      
      this.service.update(this.article.id, request)
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
          this.article = response;
          this.articleForm.get("familleId")?.patchValue(this.article.familleId);
          this.articleForm.get("designation")?.patchValue(this.article.designation);
          this.articleForm.get("emballageGrosId")?.patchValue(this.article.emballageGrosId);
          this.articleForm.get("emballageDetailId")?.patchValue(this.article.emballageDetailId);
          this.articleForm.get("quantiteDetail")?.patchValue(this.article.quantiteDetail);
          this.articleForm.get("stockMinimal")?.patchValue(this.article.stockMinimal);
          
          this.articleDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.articleForm.get("familleId")?.patchValue('');
      this.articleForm.get("designation")?.patchValue('');
      this.articleForm.get("emballageGrosId")?.patchValue('');
      this.articleForm.get("emballageDetailId")?.patchValue('');
      this.articleForm.get("quantiteDetail")?.patchValue('');
      this.articleForm.get("stockMinimal")?.patchValue('');
      this.article = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.article = response;
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
      this.articleDialog = true;
    }
    
    fermerDialog() {
      this.articleDialog = false;
    }
    
    get familleIdValue(){
      return this.articleForm.get("familleId")
    }
    
    get designationValue(){
      return this.articleForm.get("designation")
    }
    
    get emballageGrosIdValue(){
      return this.articleForm.get("emballageGrosId")
    }
    
    get emballageDetailIdValue(){
      return this.articleForm.get("emballageDetailId")
    }
    
    get quantiteDetailValue(){
      return this.articleForm.get("quantiteDetail")
    }
    
    get stockMinimalValue(){
      return this.articleForm.get("stockMinimal")
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
  