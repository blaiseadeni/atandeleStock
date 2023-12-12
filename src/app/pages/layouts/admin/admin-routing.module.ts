import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionsComponent } from 'src/app/modules/admin/editions/editions.component';
import { FichiersComponent } from 'src/app/modules/admin/fichiers/fichiers.component';
import { ParametresComponent } from 'src/app/modules/admin/parametres/parametres.component';
import { TraitementsComponent } from 'src/app/modules/admin/traitements/traitements.component';


const routes: Routes = [
  { path: 'fichiers', component: FichiersComponent, loadChildren: () => import('../../../modules/admin/fichiers/fichiers.module').then(m => m.FichiersModule) },
  { path: 'editions', component: EditionsComponent, loadChildren: () => import('../../../modules/admin/editions/editions.module').then(m => m.EditionsModule) },
  { path: 'traitements', component: TraitementsComponent, loadChildren: () => import('../../../modules/admin/traitements/traitements.module').then(m => m.TraitementsModule) },
  { path: 'parametres', component: ParametresComponent, loadChildren: () => import('../../../modules/admin/parametres/parametres.module').then(m => m.ParametresModule) },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
