import { ActiviteSecondaireComponent } from './components/entreprises/activite-secondaire/activite-secondaire.component';
import { MonnaieComponent } from './components/monnaie/monnaie.component';
import { EmballageComponent } from './components/emballage/emballage.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignaletiqueComponent } from './components/signaletique/signaletique.component';
import { MajUtilisateurComponent } from './components/maj-utilisateur/maj-utilisateur.component';
import { NatureProduitsComponent } from './components/nature-produits/nature-produits.component';
import { StatusEntreprisesComponent } from './components/status-entreprises/status-entreprises.component';
import { LocationComponent } from './components/location/location.component';
import { MobilisationComponent } from './components/entreprises/mobilisation/mobilisation.component';
import { NatureProdEntrepriseComponent } from './components/entreprises/nature-prod-entreprise/nature-prod-entreprise.component';
import { ChangemntStatusComponent } from './components/entreprises/changemnt-status/changemnt-status.component';
import { FamilleComponent } from './components/famille/famille.component';
import { FournisseurComponent } from './components/fournisseur/fournisseur.component';
import { PortefeuilleComponent } from './components/portefeuille/portefeuille.component';
import { DepenseComponent } from './components/depense/depense.component';

@NgModule({
  declarations:[],
  imports: [RouterModule.forChild(
    [
      {path: 'famille', component: FamilleComponent},
      {path: 'emballage', component: EmballageComponent},
      {path: 'monnaie', component: MonnaieComponent},
      {path: 'signaletique', component: SignaletiqueComponent},
      {path: 'location', component: LocationComponent},
      {path: 'fournisseur', component: FournisseurComponent},
      {path: 'portefeuille', component: PortefeuilleComponent},
      {path: 'depense', component: DepenseComponent},
    ]
    )],
    exports: [RouterModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class FichiersRoutingModule { }
  