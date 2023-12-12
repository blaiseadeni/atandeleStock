import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametresComponent } from './parametres.component';
import { SocieteComponent } from './components/societe/societe.component';
import { UtilisateurComponent } from './components/utilisateur/utilisateur.component';

const routes: Routes = [
  { path: 'societe', component: SocieteComponent },
  { path: 'utilisateur', component: UtilisateurComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametresRoutingModule { }
