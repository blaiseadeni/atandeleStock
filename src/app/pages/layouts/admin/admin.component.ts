import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from 'src/app/_primeng/services/app.menu.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
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
    public app: AppComponent) { }

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

}
