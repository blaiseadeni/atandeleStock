import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AdminComponent } from './pages/layouts/admin/admin.component';
import { AuthComponent } from './pages/layouts/auth/auth.component';
import { ClientComponent } from './pages/layouts/client/client.component';
import { WelcomeComponent } from './pages/layouts/welcome/welcome.component';
import { ErrorsComponent } from './pages/shared/errors/errors.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'auth',
                pathMatch: 'full'
            },
            { path: 'admin', component: AdminComponent, loadChildren: () => import('./pages/layouts/admin/admin.module').then(m => m.AdminModule) },
            { path: 'auth', component: AuthComponent, loadChildren: () => import('./pages/layouts/auth/auth.module').then(m => m.AuthModule) },
            { path: 'client', component: ClientComponent, loadChildren: () => import('./pages/layouts/client/client.module').then(m => m.ClientModule) },
            { path: 'error', component: ErrorsComponent, loadChildren: () => import('./pages/shared/errors/errors.module').then(m => m.ErrorsModule) },
            { path: 'welcome', component: WelcomeComponent, loadChildren: () => import('./pages/layouts/welcome/welcome.module').then(m => m.WelcomeModule) },
            
            {
                path: '**', redirectTo: 'error/404', pathMatch: 'full'
            },
        ], {
            scrollPositionRestoration: 'enabled',
            onSameUrlNavigation: 'reload',
            useHash: true
        })
    ],
exports: [RouterModule],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class AppRoutingModule {
}
