import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import {MenuItem} from '../../model/MenuItem';
import {SessionModel} from '../../model/Session';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  menuItems: MenuItem[];
  isOpenSideBar = true;
  constructor(private renderer: Renderer2, private session: SessionModel, private route: Router) {
    this.menuItems = [
    ];
  }

  ngOnInit() {
    if (this.session.isAdmin()) {
      this.menuItems = [
        new MenuItem({ icon: 'fa-dashboard', name: 'Dashboard', location: 'dashboard', title: 'Dashboard' }),
        // new MenuItem({ icon: 'fa-building', name: 'Appartement', location: 'appartement', title: 'Appartement' }),
        // new MenuItem({ icon: 'fa-user-secret', name: 'Manager', location: 'manager', title: 'Manager' }),
        // new MenuItem({ icon: 'fa-user', name: 'Customer', location: 'tenant', title: 'Customer' }),
        // new MenuItem({ icon: 'fa-ticket', name: 'Ticket', location: 'ticket', title: 'Ticket' }),
        new MenuItem({ icon: 'fa-user-secret', name: 'Farm Owner', location: 'farmOwner', title: 'Farm Owner' }),
        new MenuItem({ icon: 'fa-tree', name: 'Farms', location: 'farms', title: 'Farms' }),
        new MenuItem({ icon: 'fa-snowflake-o', name: 'Seeds', location: 'seeds', title: 'Seeds' }),
        new MenuItem({ icon: 'fa-user', name: 'Pod Owner', location: 'podOwner', title: 'Pod Owner' }),
        new MenuItem({ icon: 'fa-eercast', name: 'Pods', location: 'pods', title: 'Pods' }),
        new MenuItem({ icon: 'fa-podcast', name: 'Beds', location: 'beds', title: 'Beds' }),
      ];
      // this.appService.getDashboardDetails().subscribe((res) => {
      //   console.log(res);
      //   if (this.dashboard) {
      //     this.dashboard.recentTicketCount = res.recent.length;
      //     this.dashboard.openTicketCount = res.open.length;
      //     this.dashboard.totalTicketCount = res.total.length;
      //     this.dashboard.closedTicketCount = res.closed.length;
      //   }
      // });
    } else if (this.session.isManager() || this.session.isTenant()) {
      this.menuItems = [
        new MenuItem({ icon: 'fa-dashboard', name: 'Dashboard', location: 'dashboard', title: 'Dashboard' }),
        new MenuItem({ icon: 'fa-building', name: 'Appartement', location: 'appartement', title: 'Appartement' }),
        new MenuItem({ icon: 'fa-ticket', name: 'Ticket', location: 'ticket', title: 'Ticket' }),
      ];
    }
  }

  onHideSideBar() {
    this.isOpenSideBar = !this.isOpenSideBar;
    if (!this.isOpenSideBar) {
      this.renderer.addClass(document.body, 'sidenav-toggled');
    } else {
      this.renderer.removeClass(document.body, 'sidenav-toggled');
    }
  }

  onNavigate(menu) {
    if (this.session.isTenant() && menu.getLocation() === 'appartement') {
      this.route.navigate(['/appartement/info']);
    } else {
      this.route.navigate([menu.getLocation()]);
    }
  }
}



