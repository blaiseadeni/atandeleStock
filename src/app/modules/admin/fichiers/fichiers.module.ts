import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { PrimengModule } from 'src/app/_primeng/primeng.module'


import { FichiersRoutingModule } from './fichiers-routing.module';
import { FichiersComponent } from './fichiers.component';
import { EmballageComponent } from './components/emballage/emballage.component';
import { SignaletiqueComponent } from './components/signaletique/signaletique.component';
import { MajUtilisateurComponent } from './components/maj-utilisateur/maj-utilisateur.component';
import { MonnaieComponent } from './components/monnaie/monnaie.component';
import { NatureProduitsComponent } from './components/nature-produits/nature-produits.component';
import { StatusEntreprisesComponent } from './components/status-entreprises/status-entreprises.component';
import { LocationComponent } from './components/location/location.component';
import { MobilisationComponent } from './components/entreprises/mobilisation/mobilisation.component';
import { ActiviteSecondaireComponent } from './components/entreprises/activite-secondaire/activite-secondaire.component';
import { NatureProdEntrepriseComponent } from './components/entreprises/nature-prod-entreprise/nature-prod-entreprise.component';
import { ChangemntStatusComponent } from './components/entreprises/changemnt-status/changemnt-status.component';
import { FamilleComponent } from './components/famille/famille.component';
import { FournisseurComponent } from './components/fournisseur/fournisseur.component';
import { PortefeuilleComponent } from './components/portefeuille/portefeuille.component';
import { DepenseComponent } from './components/depense/depense.component';


@NgModule({
  declarations: [
    FichiersComponent,
    EmballageComponent,
    MonnaieComponent,
    SignaletiqueComponent,
    MajUtilisateurComponent,
    NatureProduitsComponent,
    StatusEntreprisesComponent,
    LocationComponent,
    MobilisationComponent,
    ActiviteSecondaireComponent,
    NatureProdEntrepriseComponent,
    ChangemntStatusComponent,
    FamilleComponent,
    FournisseurComponent,
    PortefeuilleComponent,
    DepenseComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    FormsModule,
    FichiersRoutingModule,
    ToolbarModule ,
    PrimengModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class FichiersModule { }
