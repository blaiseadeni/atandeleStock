import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { PrimengModule } from 'src/app/_primeng/primeng.module';


@NgModule({
  declarations: [
    ClientComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
