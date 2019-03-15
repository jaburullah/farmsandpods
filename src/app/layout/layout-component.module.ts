import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NavComponent,
    SidenavComponent,
    BreadcrumbComponent,
    FooterComponent
  ],
  exports: [
    NavComponent,
    SidenavComponent,
    BreadcrumbComponent,
    FooterComponent
  ]
})
export class LayoutComponentModule {}
