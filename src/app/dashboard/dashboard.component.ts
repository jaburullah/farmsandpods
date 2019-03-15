import { Component, OnInit } from '@angular/core';
import {SessionModel} from '../model/Session';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceService} from '../service/app-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentTicketCount;
  closedTicketCount;
  totalTicketCount;
  openTicketCount;
  logs;

  myOpenTickets;
  myInProgressTickets;
  myClosedTickets;
  myAllTickets;
  appartementRecentTickets;
  appartementOpenTickets;
  appartementClosedTickets;
  appartmentAllTickets;
  constructor(private modalService: NgbModal,
              private appService: AppServiceService,
              private route: Router,
              public session: SessionModel,
              private notifyService: NotificationsService) {
    this.recentTicketCount = 0;
    this.closedTicketCount = 0;
    this.totalTicketCount = 0;
    this.openTicketCount = 0;
    this.appService.getDashboardDetails().subscribe((res) => {
      console.log(res);
      if (this.session.isAdmin()) {
        this.recentTicketCount = res.recent.length;
        this.openTicketCount = res.open.length;
        this.totalTicketCount = res.all.length;
        this.closedTicketCount = res.closed.length;
        this.logs = res.logs;
      } else if (this.session.isManager()) {
        this.recentTicketCount = res.recent.length;
        this.openTicketCount = res.open.length;
        this.totalTicketCount = res.all.length;
        this.closedTicketCount = res.closed.length;
        this.logs = res.logs;
      } else if (this.session.isTenant()) {

        this.myOpenTickets = res.myOpenTickets.length;
        this.myInProgressTickets = res.myInProgressTickets.length;
        this.myClosedTickets = res.myClosedTickets.length;
        this.myAllTickets = res.myAllTickets.length;

        this.appartementRecentTickets = res.appartementRecentTickets.length;
        this.appartementOpenTickets = res.appartementOpenTickets.length;
        this.appartementClosedTickets = res.appartementClosedTickets.length;
        this.appartmentAllTickets = res.appartmentAllTickets.length;

        // this.recentTicketCount = res.recent.length;
        // this.openTicketCount = res.open.length;
        // this.totalTicketCount = res.all.length;
        // this.closedTicketCount = res.closed.length;
        this.logs = res.logs;

      }

      this.session = session;
    });
  }

  ngOnInit() {
  }

}
