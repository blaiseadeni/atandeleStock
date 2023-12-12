import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametresRoutingModule } from './parametres-routing.module';
import { ParametresComponent } from './parametres.component';
import { SocieteComponent } from './components/societe/societe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PrimengModule } from 'src/app/_primeng/primeng.module';
import { UtilisateurComponent } from './components/utilisateur/utilisateur.component';


@NgModule({
  declarations: [
    ParametresComponent,
    SocieteComponent,
    UtilisateurComponent
  ],
  imports: [
    CommonModule,
    ParametresRoutingModule,
    FormsModule,
    ToolbarModule ,
    PrimengModule,
    ReactiveFormsModule
  ]
})
export class ParametresModule { }
