import { Component, OnInit } from '@angular/core';
import { MouvementService } from '../../services/mouvement.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent implements OnInit{
  cols: any = [];
  mouvements: any = [];
  
  locationId: any;
  
  constructor(
    private service: MouvementService,
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
          this.mouvements = response;
          console.log(this.mouvements);
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
  