import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from 'src/app/modules/auth/login/login.component';
import { PrimengModule } from 'src/app/_primeng/primeng.module';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
