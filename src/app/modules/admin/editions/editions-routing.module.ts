import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionsComponent } from './editions.component';
import { ImpressionComponent } from './components/impression/impression.component';

const routes: Routes = [
  { path: '', component: EditionsComponent },
  {path:'impression',component: ImpressionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditionsRoutingModule { }
