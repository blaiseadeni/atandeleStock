import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'body[root]',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    
    layoutMode = 'static';
    darkMenu = false;
    profileMode = 'popup';
    inputStyle = 'outlined';
    ripple: boolean;
    
    constructor(private primengConfig: PrimeNGConfig) { }
    
    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
