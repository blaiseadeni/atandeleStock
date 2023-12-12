import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class FactureListComponent implements OnInit {
  
  cols: any = [];
  deleteDialog: boolean = false;
  factures: any = [];
  
  total: any;
  
  constructor(
    private service: FactureService,
    private messageService: MessageService,
    ) { }
    
    
    ngOnInit(): void {
      this.getAll();
    }
    
    getAll() {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          this.factures = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    
  }
  