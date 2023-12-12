import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './errors.component';
import { AppInternalErrorComponent } from './components/internal-error/app.internal-error.component';
import { AppNotfoundComponent } from './components/not-found/app.notfound.component';
import { AppAccessdeniedComponent } from './components/access-denied/app.access-denied.component';
import { AppOccuredComponent } from './components/occured/app.occured.component';


@NgModule({
  declarations: [
    ErrorsComponent,
    AppInternalErrorComponent,
    AppNotfoundComponent,
    AppAccessdeniedComponent,
    AppOccuredComponent, 
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule { }
