import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../../_primeng/partials/services/event.service';
import {MenuItem} from 'primeng/api';
import {Product} from '../../../../_primeng/common/models/product';
import {ProductService} from '../../../../_primeng/partials/services/product.service';
import {BreadcrumbService} from '../../../../_primeng/services/app.breadcrumb.service';

// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../../../assets/badges.scss'],
    styles: [`
    @media screen and (max-width: 960px) {
        :host ::ng-deep .fc-header-toolbar {
            display: flex;
            flex-wrap: wrap;
            
            .fc-dayGridMonth-button {
                margin-top: 1rem;
            }
            .fc-timeGridWeek-button{
                margin-top: 1rem;
            }
            .fc-timeGridDay-button{
                margin-top: 1rem;
            }
        }
    }
    
    :host ::ng-deep {
        .fc.fc-theme-standard .fc-highlight {
            color: #ffffff;
            background: var(--fc-highlight-color, rgba(63, 81, 181, 0.12));
        }
    }
    `]
})
export class DashboardComponent implements OnInit {
    
    //debut pour le graphiaque  
    barData: any;
    barOptions: any;    
    //fin pour le graphiaque 
    products: Product[];
    
    chartData: any;
    
    chartOptions: any;
    
    events: any[];
    
    items: MenuItem[];
    
    fullCalendarOptions: any;
    
    constructor(private productService: ProductService, private eventService: EventService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            {label: 'Dashboard', routerLink: ['']}
        ]);
    }
    
    ngOnInit() {
        
        this.barData = {
            labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Jullet', 'Août','Septemtre','Octobre','Novembre','Decembre'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    data: [65, 59, 90, 81, 56, 55, 40, 39, 24, 12, 56, 190]
                },
                
            ]
        };
        
        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: '#A0A7B5'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#A0A7B5'
                    },
                    grid: {
                        color:  'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#A0A7B5'
                    },
                    grid: {
                        color:  'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };
        
        
        
        this.productService.getProducts().then(data => this.products = data);
        this.eventService.getEvents().then(events => {
            this.events = events;
            this.fullCalendarOptions = {...this.fullCalendarOptions, ...{events: events}};
        });
        
        this.chartData = {
            labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Jullet', 'Août','Septemtre','Octobre','Novembre','Decembre'],
            datasets: [
                {
                    label: 'Depenses',
                    data: [7, 12, 15, 5, 3, 13, 21, 38, 12, 40, 34, 100],
                    borderColor: [
                        '#FFB300',
                    ],
                    borderWidth: 3,
                    fill: false,
                    pointRadius: [4, 6, 4, 12, 8, 0, 4],
                    tension: .4
                },
                {
                    label: 'Commandes',
                    data: [3, 7, 2, 17, 15, 13, 19, 100, 290, 30, 18, 0],
                    borderColor: [
                        '#66BB6A',
                    ],
                    borderWidth: 3,
                    fill: false,
                    tension: .4
                }
            ]
        };
        
        this.chartOptions = {
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                x: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                },
                y: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }
            }
        };
        
        
        
        
    }
}
