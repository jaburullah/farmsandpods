import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ManageComponent} from './manage/manage.component';
import { CreateComponent } from './create/create.component';
import { BedLayoutRoutes } from './bed.routing';

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
import {MomentModule} from 'angular2-moment';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BedLayoutRoutes),
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
    CreateComponent
  ]
})
export class BedRoutingModule {}
