import { Component, OnInit } from '@angular/core';
import { InventaireService } from '../../services/inventaire.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class EtatStockComponent implements OnInit{
  cols: any = [];
  inventConts: any = [];
  utilisateurId: any;
  locationId: any;
  inventaireForm: FormGroup;
  inventaireDialog: boolean = false;
  request: any = {};
  list: any = [];
  /**
  *
  */
  constructor(
    private service: InventaireService,
    private jwtHelper: JwtHelperService,
    private fb: FormBuilder,
    private messageService: MessageService,
    ) {
      
    }
    ngOnInit(): void {
      this.inventaireForm = new FormGroup({
        date1: new FormControl('', Validators.required),
        date2: new FormControl('', Validators.required),
      });
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateurId = decodeJWT.utilisateurId;
      this.locationId = decodeJWT.locationId;
      
      this.findAll(this.locationId);
    }
    
    add() {
      const detail: any = [];
      this.inventConts.forEach(element => {
        const items = {
          date: this.date1Value.value,
          date1: this.date2Value.value,
          articleId: element.articleId,
          locationId: this.locationId,
          utilisateurId: this.utilisateurId,
          stockInit: element.stockInitial,
          montantInit: element.montantInitial,
          qteEnt:  element.qteEnt,
          montantEnt:  element.montantEnt,
          qteSort:  element.qteSort,
          montantSort: element.montantSort,
          stockFinal: element.stockFinal,
          montantFinal: element.montantFinal
          
        }
        detail.push(items);
      });
      const value = JSON.stringify(detail)
      // console.log(value);
      this.service.add(value)
      .subscribe({
        next: (response) => {
          this.inventConts = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
      this.findAll(this.locationId);
    }
    
    get() {
      const request = {
        id: this.locationId,
        date1: this.date1Value.value,
        date2: this.date2Value.value,
      }
      if (this.inventaireForm.valid) {
        if (request.date1.getTime() > request.date2.getTime()) {
          this.messageService.add({ severity: 'error', summary: 'Info', detail: 'Dates invalides', life: 3000 });
        } else {
          this.service.get(request)
          .subscribe({
            next: (response) => {
              this.inventConts = response;
            },
            error: (errors) => {
              console.log(errors);
            }
          });
        }
        
      } else {
        this.validateAllFields(this.inventaireForm);
      }
      
    }
    
    findAll(id:any) {
      this.service.getAll(id)
      .subscribe({
        next: (response) => {
          this.list = response;
          // console.log(this.list);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    reset() {
      this.inventaireForm = this.fb.group({
        date1: [],
        date2: [],
      });
    }
    
    ouvrirDialog() {
      this.inventaireDialog = true;
    }
    
    fermerDialog() {
      this.inventaireDialog = false;
      this.inventConts = [];
      this.reset();
    }
    
    get date1Value() {
      return this.inventaireForm.get("date1")
    }
    get date2Value() {
      return this.inventaireForm.get("date2")
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
  