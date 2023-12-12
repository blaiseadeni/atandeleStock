import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { PrimengModule } from 'src/app/_primeng/primeng.module';


@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    WelcomeRoutingModule
  ]
})
export class WelcomeModule { }
