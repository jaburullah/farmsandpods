import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppartementComponent} from './appartement/appartement.component';
import { LayoutComponent} from './layout/layout.component';
import {ManagerRoutingModule} from './manager/manager.module';
import {ManagerComponent} from './manager/manager.component';
import {TenantComponent} from './tenant/tenant.component';
import {TicketComponent} from './ticket/ticket.component';
import {AuthenticationResolve} from './service/Authentication';
import { FarmOwnerComponent } from './farm-owner/farm-owner.component';
import { FarmComponent } from './farm/farm.component';
import { SeedComponent } from './seed/seed.component';
import { PodOwnerComponent } from './pod-owner/pod-owner.component';
import { PodComponent } from './pod/pod.component';

// farms
import { FarmDashboardComponent } from './farm-dashboard/farm-dashboard.component';
import { FarmLoginComponent } from './farm-login/farm-login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: FarmLoginComponent },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: FarmDashboardComponent },
      {
        path: 'appartement', component: AppartementComponent,
        children: [
          {
            path: '',
            loadChildren: './appartement/appartement-routing.module#AppartementRoutingModule'
          }
        ]
      },
      {
        path: 'manager', component: ManagerComponent,
        children: [
          {
            path: '',
            loadChildren: './manager/manager.module#ManagerRoutingModule'
          }
        ]
      },
      {
        path: 'tenant', component: TenantComponent,
        children: [
          {
            path: '',
            loadChildren: './tenant/tenant.module#TenantRoutingModule'
          }
        ]
      },
      {
        path: 'ticket', component: TicketComponent,
        children: [
          {
            path: '',
            loadChildren: './ticket/ticket.module#TicketRoutingModule'
          }
        ]
      },
      {
        path: 'farmOwner', component: FarmOwnerComponent, children: [
          {
            path: '',
            loadChildren: './farm-owner/farm-owner-routing.module#FarmOwnerRoutingModule'
          }
        ]
      },
      {
        path: 'farms', component: FarmComponent, children: [
          {
            path: '',
            loadChildren: './farm/farm-routing.module#FarmsRoutingModule'
          }
        ]
      },
      {
        path: 'seeds', component: SeedComponent, children: [
          {
            path: '',
            loadChildren: './seed/seed-routing.module#SeedsRoutingModule'
          }
        ]
      },
      {
        path: 'podOwner', component: PodOwnerComponent, children: [
          {
            path: '',
            loadChildren: './pod-owner/pod-owner-routing.module#PodOwnerRoutingModule'
          }
        ]
      },
      {
        path: 'pods', component: PodComponent, children: [
          {
            path: '',
            loadChildren: './pod/pod-routing.module#PodRoutingModule'
          }
        ]
      },
      {
        path: 'beds', component: PodComponent, children: [
          {
            path: '',
            loadChildren: './bed/bed-routing.module#BedRoutingModule'
          }
        ]
      },
    ],
    resolve: {
      data: AuthenticationResolve,
    }
  },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
