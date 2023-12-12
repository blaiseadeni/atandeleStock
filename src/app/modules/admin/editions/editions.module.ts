import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';
import { EditionsComponent } from './editions.component';


@NgModule({
  declarations: [
    EditionsComponent
  ],
  imports: [
    CommonModule,
    EditionsRoutingModule
  ]
})
export class EditionsModule { }
