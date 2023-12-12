import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './components/article/article.component';
import { CoursChangeComponent } from './components/coursChange/cours-change.component';
import { LivraisonListComponent } from './components/Livraison-list/livraison-list.component';
import { LivraisonComponent } from './components/Livraison/livraison.component';
import { AchatListComponent } from './components/achat-list/achat-list.component';
import { AchatComponent } from './components/achat/achat.component';
import { CommandeComponent } from './components/commande/commande.component';
import { CommandeListComponent } from './components/commande-liste/commande-list.component';
import { PrixArticleLocationComponent } from './components/prix-article-location/prix-article-location.component';
import { MouvementComponent } from './components/mouvement/mouvement.component';
import { EtatStockComponent } from './components/etat-stock/etat-stock.component';
import { FactureComponent } from './components/facture/facture.component';
import { FactureListComponent } from './components/facture-list/facture-list.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { InventaireComponent } from './components/inventaire/inventaire.component';
import { StockComponent } from './components/stock/stock.component';

@NgModule({
  imports: [RouterModule.forChild(
    [
      {path:'article', component: ArticleComponent},
      {path:'coursChange', component: CoursChangeComponent},
      {path:'commande', component: CommandeComponent},
      {path:'commande-list', component: CommandeListComponent},
      {path:'livraison', component: LivraisonComponent},
      {path:'livraison-list', component: LivraisonListComponent},
      {path:'achat', component: AchatComponent},
      {path:'achat-list', component: AchatListComponent},
      {path:'prix-article-location', component: PrixArticleLocationComponent},
      { path: 'mouvement', component: MouvementComponent},
      {path:'stock', component: StockComponent},
      {path:'facture', component: FactureComponent},
      {path:'facture-list', component: FactureListComponent},
      {path:'paiement', component: PaiementComponent},
      {path:'inventaire', component: InventaireComponent},
      {path:'inventaire-compt', component: EtatStockComponent},
    ]
    )],
    exports: [RouterModule],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
  })
  export class TraitementsRoutingModule { }
  