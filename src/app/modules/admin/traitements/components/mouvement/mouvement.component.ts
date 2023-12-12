import { Component, OnInit } from '@angular/core';
import { MouvementService } from '../../services/mouvement.service';

@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent implements OnInit{
  cols: any = [];
  mouvements: any = [];
  
  constructor(
    private service: MouvementService,
    ) { }
    
    
    ngOnInit(): void {
      this.getAll();
    }
    
    getAll() {
      this.service.getAll()
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
    
  }
  