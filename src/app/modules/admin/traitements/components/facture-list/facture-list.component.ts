import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FactureService } from '../../services/facture.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class FactureListComponent implements OnInit {
  
  cols: any = [];
  factures: any = [];
  deleteDialog: boolean = false;
  
  total: any;
  
  url: any;
  locationId: any;
  
  constructor(
    private service: FactureService,
    private messageService: MessageService,
    private jwtHelper: JwtHelperService
    ) { }
    
    
    ngOnInit(): void {
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.locationId = decodeJWT.locationId;
      this.getAll();
    }
    
    getAll() {
      this.service.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.factures = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    PrintPOS(id: any) {
      this.service.PrintPOS(id).subscribe(res => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    }
    
    PrintA4(id: any) {
      this.service.GeneratePDF(id).subscribe(res => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    }
    
    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    
  }
  