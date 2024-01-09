import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-menu',
    template: `
    <ul class="layout-menu">
    <li app-menuitem *ngFor="let item of model; let i = index;"
    [item]="item" [index]="i" [visible]="true" [root]="true"></li>
    </ul>
    `
})
export class AppMenuComponent implements OnInit {
    
    model: any[];
    role: any;
    
    constructor(
        private jwtHelper: JwtHelperService,
        ) { }
        
        ngOnInit() {
            const token = localStorage.getItem('jwt');
            const decodeJWT = this.jwtHelper.decodeToken(token);
            this.role = decodeJWT.role;
            
            this.model = [
                {
                    label: 'Accuiel', icon: 'pi pi-fw pi-home',
                    items: [
                        { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
                        {
                            label: 'Fichiers', icon: 'pi pi-folder', routerLink: ['/'],
                            items: [
                                {label: 'Famille', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/famille'],visible:this.role != "FACTURIER"},
                                {label: 'Emballage ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/emballage'],visible:this.role != "FACTURIER"},
                                // {label: 'Monnaie ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/monnaie']},
                                // {label: 'Location ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/location']},
                                {label: 'Article', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/article'],visible:this.role != "FACTURIER"},
                                // {label: 'Cours de change ', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/coursChange']},
                                {label: 'Fournisseur ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/fournisseur'],visible:this.role != "FACTURIER" },
                                {label: 'Client ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/signaletique'] },
                                {label: 'Avance sur client  ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/portefeuille'] },
                                {label: 'Dépense', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/depense'] },
                            ]
                        },
                        {
                            label: 'Traitements', icon: 'pi pi-pencil', routerLink: ['/'],
                            items: [
                                {
                                    label: 'Commande ', icon: 'pi pi-folder-open', routerLink: [''],
                                    items: [
                                        {label: 'Nouvelle commande', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/commande']},
                                        {label: 'Liste des commandes', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/commande-list']},
                                        
                                    ],visible:this.role != "FACTURIER"
                                },
                                {
                                    label: 'Expédition (Pointage)', icon: 'pi pi-folder-open', routerLink: [''],
                                    items: [
                                        {label: 'Nouvelle expédition ', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/livraison']},
                                        {label: 'Liste d\'expéditions', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/livraison-list']},
                                        
                                    ],visible:this.role != "FACTURIER"
                                },
                                {
                                    label: 'Achat ', icon: 'pi pi-folder-open', routerLink: [''],
                                    items: [
                                        {label: 'Nouvel achat', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/achat']},
                                        {label: 'Liste des achats', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/achat-list']},
                                        
                                    ],visible:this.role != "FACTURIER"
                                },
                                { label: 'Prix par location', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/prix-article-location'],visible:this.role === "MANAGER", },
                                
                                {
                                    label: 'Facture ', icon: 'pi pi-folder-open', routerLink: [''],
                                    items: [
                                        {label: 'Nouvelle facture', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/facture']},
                                        {label: 'Liste des factures', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/facture-list']},
                                        
                                    ]
                                },
                                {label: 'Paiement ', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/paiement']},
                                {label: 'Liste des factures NP', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/facture-np']},
                                // {label: 'Calcul pénalité d\'assiette ', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/calcule']},
                                // {label: 'Contrôle de déclaration', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/controle']},
                            ]
                        },
                        {
                            label: 'Editions', icon: 'pi pi-print', routerLink: ['/'],
                            items: [
                                {
                                    label: 'Stock ', icon: 'pi pi-folder-open', routerLink: [''],
                                    items: [
                                        {label: 'Mouvement du stock', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/mouvement']},
                                        {label: 'Etat du stock', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/stock']},
                                        
                                    ]
                                },
                                {
                                    label: 'Inventaire ', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/inventaire'],
                                    // items: [
                                    //  {label: 'Inventaire comptable', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/inventaire-compt']},
                                    //  {label: 'Inventaire extra-comptable', icon: 'pi pi-folder-open', routerLink: ['/admin/traitements/inventaire']},
                                    
                                    // ]
                                },
                                {
                                    label: 'Impressions', icon: 'pi pi-print', routerLink: ['/admin/editions/impression'],
                                },
                                
                                // {label: 'Journal déclaration', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Balance mensuelle TP', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Situation encaissements TP', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Balance recouvrement', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Statistique déclaration TP', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Extrait de compte', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Contrôle de pénalité /recouvrement', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {
                                //     label: 'Liste des entreprises', icon: 'pi pi-print', routerLink: ['/'],
                                //     items: [
                                //         {label: 'Produits', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                //         {label: 'Produits par entreprise', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                //     ]
                                // },
                                // {label: 'Fiche de gestion', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Fiche de pénalisation', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Fiche de pénalisation /contrôle', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Liste des entreprises opérant ayant declarés', icon: 'pi pi-file-pdf', routerLink: ['/']},
                                // {label: 'Liste des entreprises opérant n\'ayant pas declarés', icon: 'pi pi-file-pdf', routerLink: ['/']},
                            ],visible:this.role != "FACTURIER"
                        },
                        {
                            label: 'Paramètres', icon: 'pi pi-cog', routerLink: ['/'] ,
                            items: [
                                { label: 'Sociétés ', icon: 'pi pi-folder-open', routerLink: ['/admin/parametres/societe']},
                                {label: 'Locations  ', icon: 'pi pi-folder-open', routerLink: ['/admin/fichiers/location']},
                                {label: 'Utilisateurs ', icon: 'pi pi-folder-open', routerLink: ['/admin/parametres/utilisateur']},
                                
                            ],visible:this.role === "MANAGER"
                        },
                    ]
                },
            ];
        }
    }
    