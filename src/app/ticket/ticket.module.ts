import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent} from './manage/manage.component';
import { CreateComponent } from './create/create.component';
import {TicketLayoutRoutes} from './ticket.routing';
import {InfoComponent} from './info/info.component';

import { ReactiveFormsModule } from '@angular/forms';

import {
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatIconModule,
  MatDividerModule,
  MatListModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TicketLayoutRoutes),
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  declarations: [
    ManageComponent,
    CreateComponent,
    InfoComponent
  ]
})
export class TicketRoutingModule {}
