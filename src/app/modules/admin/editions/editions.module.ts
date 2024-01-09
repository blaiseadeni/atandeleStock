import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';
import { EditionsComponent } from './editions.component';
import { ImpressionComponent } from './components/impression/impression.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PrimengModule } from 'src/app/_primeng/primeng.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@NgModule({
  declarations: [
    EditionsComponent,
    ImpressionComponent
  ],
  imports: [
    CommonModule,
    EditionsRoutingModule,
    CommonModule,
    FormsModule,
    ToolbarModule ,
    PrimengModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
  ]
})
export class EditionsModule { }
