import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraitementsRoutingModule } from './traitements-routing.module';
import { TraitementsComponent } from './traitements.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PrimengModule } from 'src/app/_primeng/primeng.module';
import { ArticleComponent } from './components/article/article.component';
import { CoursChangeComponent } from './components/coursChange/cours-change.component';
import { PrixArticleLocationComponent } from './components/prix-article-location/prix-article-location.component';
import { LivraisonListComponent } from './components/Livraison-list/livraison-list.component';
import { LivraisonComponent } from './components/Livraison/livraison.component';
import { AchatListComponent } from './components/achat-list/achat-list.component';
import { AchatComponent } from './components/achat/achat.component';
import { CommandeListComponent } from './components/commande-liste/commande-list.component';
import { CommandeComponent } from './components/commande/commande.component';
import { MouvementComponent } from './components/mouvement/mouvement.component';
import { EtatStockComponent } from './components/etat-stock/etat-stock.component';
import { FactureComponent } from './components/facture/facture.component';
import { FactureListComponent } from './components/facture-list/facture-list.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { InventaireComponent } from './components/inventaire/inventaire.component';
import { StockComponent } from './components/stock/stock.component';


@NgModule({
  declarations: [
    TraitementsComponent,
    ArticleComponent,
    CoursChangeComponent,
    PrixArticleLocationComponent,
    LivraisonListComponent,
    LivraisonComponent,
    AchatListComponent,
    AchatComponent,
    CommandeComponent,
    CommandeListComponent,
    MouvementComponent,
    EtatStockComponent,
    FactureComponent,
    FactureListComponent,
    PaiementComponent,
    InventaireComponent,
    StockComponent
  ],
  imports: [
    CommonModule,
    TraitementsRoutingModule,
    FormsModule,
    ToolbarModule ,
    PrimengModule,
    ReactiveFormsModule
  ]
})
export class TraitementsModule { }
