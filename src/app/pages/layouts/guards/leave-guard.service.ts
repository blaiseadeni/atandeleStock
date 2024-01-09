import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class LeaveGuardService implements CanActivateChild {
    canLeave = true;
    
    lastTrigger: 'imperative' | 'popstate' | 'hashchange';
    
    constructor(
        private router: Router,
        private location: Location,
        private jwtHelper: JwtHelperService
        ) {
            this.router.events.subscribe(event => {
                if (event instanceof NavigationStart) {
                    this.lastTrigger = event.navigationTrigger;
                }
            });
        }
        
        canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            // Fix browser history if leaving prevented and called by back/forward navigation
            const token = localStorage.getItem("jwt");
            if(token && !this.jwtHelper.isTokenExpired(token)) {
                this.location.go(state.url);
            }
            this.router.navigate(["/login"]);
            return this.canLeave;
        }
    }