import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LivraisonService } from '../../services/livraison.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-rapproche-tresorerie',
  templateUrl: './livraison-list.component.html',
  styleUrls: ['./livraison-list.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class LivraisonListComponent implements OnInit {
  
  cols: any = [];
  
  deleteDialog: boolean = false;
  
  livraisons: any = [];
  livraison: any = {};
  
  locationId: any = {};
  
  rapprochementDialog: boolean = false;
  rapprochementForm: FormGroup;
  
  constructor(
    private service: LivraisonService,
    private messageService: MessageService,
    private jwtHelper: JwtHelperService
    
    ) { }
    
    
    ngOnInit(): void {
      this.rapprochementForm = new FormGroup({
        value1: new FormControl('', Validators.required),
        value2: new FormControl('', Validators.required),
      })
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.locationId = decodeJWT.locationId;
      this.getAll();
    }
    
    getAll() {
      this.service.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.livraisons = response;
          // console.log(this.livraisons);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.livraison = response;
          this.deleteDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    delete(id: any) {
      this.service.delete(id)
      .subscribe({
        next: (response) => {
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: ' Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: 'Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
        }
      });
    }
    
    
    PrintBC(id: any) {
      this.service.GeneratePDF(id).subscribe(res => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    }
    
    hideSelect() {
      this.deleteDialog = false;
    }
    
    ouvrirDialog() {
      this.rapprochementDialog = true;
    }
    
    fermerDialog() {
      this.rapprochementDialog = false;
    }
    
    get value(){
      return this.rapprochementForm.get("value")
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
  