import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  cols: any = [];
  stocks: any = [];
  
  constructor(
    private service: StockService,
    ) { }
    ngOnInit(): void {
      this.getAll();
    }
    
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.stocks = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
  }
  
  
  
  