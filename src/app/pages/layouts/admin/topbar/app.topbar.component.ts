import { Component } from '@angular/core';
import { AppComponent} from '../../../../app.component';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    constructor(public app: AppComponent, public appMain: AdminComponent) {}
}
