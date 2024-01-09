import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  cols: any = [];
  stocks: any = [];
  
  locationId: any;
  constructor(
    private service: StockService,
    private jwtHelper:JwtHelperService
    
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
          this.stocks = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    
    
  }
  
  
  
  