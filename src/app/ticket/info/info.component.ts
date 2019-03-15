import { Component, OnInit } from '@angular/core';
import {AppServiceService} from '../../service/app-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  selectedTicketIndex = -1;
  selectedTicket = {
    category: '',
    status: '',
    priority: '',
    assignee: '',
    reporter: '',
    summary: '',
    description: ''
  };
  constructor(private appService: AppServiceService, private router: Router) {
    this.appService.getManager().subscribe((managerRes) => {
      this.appService.getTenant().subscribe((tenantRes) => {
        this.selectedTicketIndex = this.appService.selectedTicketIndex;
        if (this.selectedTicketIndex >= 0) {
          const selectedTicket = JSON.parse(JSON.stringify(this.appService.ticket[this.selectedTicketIndex]));
          const manager = managerRes.find(x => selectedTicket.assignee === x._id);
          const reporter = tenantRes.find(x => selectedTicket.reporter === x._id);
          selectedTicket.assignee = manager.name;
          selectedTicket.reporter = reporter.name;
          // selectedTicket.summary = reporter.name;
          this.selectedTicket = selectedTicket;
        }
      });
    });
  }

  ngOnInit() {
  }

  onClickBack() {
    this.appService.selectedTicketIndex = -1;
    this.selectedTicketIndex = -1;
    this.router.navigate(['/ticket/manage']);
  }
}
