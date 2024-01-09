import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Table } from 'primeng/table';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-facture-np',
  templateUrl: './facture-np.component.html',
  styleUrls: ['./facture-np.component.scss']
})
export class FactureNpComponent {
  
  cols: any = [];
  factures: any = [];
  
  locationId: any;
  
  constructor(
    private service: FactureService,
    private jwtHelper: JwtHelperService
    ) { }
    
    
    ngOnInit(): void {
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.locationId = decodeJWT.locationId;
      this.getAll();
    }
    
    getAll() {
      this.service.getAllNp(this.locationId)
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
  