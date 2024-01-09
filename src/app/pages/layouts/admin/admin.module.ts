import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { AppBreadcrumbComponent } from './breadcrumb/app.breadcrumb.component';
import { AppConfigComponent } from './configs/app.config.component';
import { AppFooterComponent } from './footer/app.footer.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menu/app.menuitem.component';
import { AppProfileComponent } from './profile/app.profile.component';
import { AppTopBarComponent } from './topbar/app.topbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrimengModule } from 'src/app/_primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppConfigComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppBreadcrumbComponent,
    AppProfileComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
})
export class AdminModule { }
