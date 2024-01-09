import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { PrimeNGConfig } from 'primeng/api';
import { BreadcrumbService } from 'src/app/_primeng/services/app.breadcrumb.service';
import { MenuService } from 'src/app/_primeng/services/app.menu.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers:[{provide:JWT_OPTIONS, useValue: JWT_OPTIONS},JwtHelperService]
})
export class AdminComponent {
 
  
  rotateMenuButton: boolean;
  topbarMenuActive: boolean;
  overlayMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuClick: boolean;
  topbarItemClick: boolean;
  configClick: boolean;
  activeTopbarItem: any;
  menuHoverActive: boolean;
  configActive: boolean;
  inlineMenuActive: boolean;
  inlineMenuClick: boolean;
  
  constructor(
    private menuService: MenuService,
    private primengConfig: PrimeNGConfig,
    public app: AppComponent,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private jwtHelper: JwtHelperService) { 
      this.breadcrumbService.setItems([
        {label: 'Graphique'}
      ]);
    }
    
    onLayoutClick() {
      if (!this.topbarItemClick) {
        this.activeTopbarItem = null;
        this.topbarMenuActive = false;
      }
      
      if (!this.menuClick || (this.inlineMenuClick && this.isSlim())) {
        if (this.isHorizontal() || this.isSlim()) {
          this.menuService.reset();
        }
        
        if (this.overlayMenuActive || this.staticMenuMobileActive) {
          this.hideOverlayMenu();
        }
        
        this.menuHoverActive = false;
      }
      
      if (this.configActive && !this.configClick) {
        this.configActive = false;
      }
      
      if (this.inlineMenuActive && !this.inlineMenuClick && !this.isStatic()) {
        this.inlineMenuActive = false;
      }
      
      this.inlineMenuClick = false;
      this.configClick = false;
      this.topbarItemClick = false;
      this.menuClick = false;
    }
    
    onMenuButtonClick(event) {
      this.menuClick = true;
      this.rotateMenuButton = !this.rotateMenuButton;
      this.topbarMenuActive = false;
      
      if (this.app.layoutMode === 'overlay' && (!this.isMobile() && !this.isTablet())) {
        this.overlayMenuActive = !this.overlayMenuActive;
      } else {
        if (this.isDesktop()) {
          this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
          this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }
      }
      
      event.preventDefault();
    }
    
    onMenuClick($event) {
      this.menuClick = true;
      
      if (this.inlineMenuActive && !this.inlineMenuClick && !this.isStatic()) {
        this.inlineMenuActive = false;
      }
    }
    
    onInlineMenuClick(event) {
      this.inlineMenuActive = !this.inlineMenuActive;
      this.inlineMenuClick = true;
    }
    
    onTopbarMenuButtonClick(event) {
      this.topbarItemClick = true;
      this.topbarMenuActive = !this.topbarMenuActive;
      
      this.hideOverlayMenu();
      
      event.preventDefault();
    }
    
    onTopbarItemClick(event, item) {
      this.topbarItemClick = true;
      
      if (this.activeTopbarItem === item) {
        this.activeTopbarItem = null;
      } else {
        this.activeTopbarItem = item;
      }
      
      event.preventDefault();
    }
    
    onTopbarSubItemClick(event) {
      event.preventDefault();
    }
    
    onConfigClick(event) {
      this.configClick = true;
    }
    
    onRippleChange(event) {
      this.app.ripple = event.checked;
      this.primengConfig = event.checked;
    }
    
    hideOverlayMenu() {
      this.rotateMenuButton = false;
      this.overlayMenuActive = false;
      this.staticMenuMobileActive = false;
    }
    
    isTablet() {
      const width = window.innerWidth;
      return width <= 1024 && width > 640;
    }
    
    isDesktop() {
      return window.innerWidth > 1024;
    }
    
    isMobile() {
      return window.innerWidth <= 640;
    }
    
    isOverlay() {
      return this.app.layoutMode === 'overlay';
    }
    
    isHorizontal() {
      return this.app.layoutMode === 'horizontal';
    }
    
    isSlim() {
      return this.app.layoutMode === 'slim';
    }
    
    isStatic() {
      return this.app.layoutMode === 'static';
    }
    
    //Authentification jwt
    
    isAuthenticated() {
      const token: string = localStorage.getItem("jwt");
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      } else {
        return false;
      }
    }
    
    
  }
  