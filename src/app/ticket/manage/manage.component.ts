import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AppServiceService} from '../../service/app-service.service';
import {ManagerModel} from '../../model/ManagerModel';
import {Router} from '@angular/router';
import {TicketModel} from '../../model/TicketModel';
import {SessionModel} from '../../model/Session';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'category', 'type', 'priority', 'description', 'action'];
  // appartementGrid: Response[] = [];
  ticketGrid = new MatTableDataSource<TicketModel>(null);
  myTicketGrid = new MatTableDataSource<TicketModel>(null);
  @ViewChild('ticketpagenator') paginator: MatPaginator;
  @ViewChild('myticketpagenator') myTicketPaginator: MatPaginator;
  constructor(private router: Router,
              public session: SessionModel,
              private appService: AppServiceService) {
    this.session = session;
    this.appService.selectedTicketIndex = -1;
  }

  ngOnInit() {
    this.appService.getTicket().subscribe((data) => {
      if (this.session.isAdmin()) {
        this.ticketGrid = new MatTableDataSource<TicketModel>(data); // new MatTableDataSource<Response>(data);
        this.ticketGrid.paginator = this.paginator;
      } else  if (this.session.isManager()) {
        this.ticketGrid = new MatTableDataSource<TicketModel>(data); // new MatTableDataSource<Response>(data);
        this.ticketGrid.paginator = this.paginator;
      } else  if (this.session.isTenant()) {
        const myTickets = [],
                tickets = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].owner === this.session.getUserId()) {
            myTickets.push(data[i]);
          } else {
            tickets.push(data[i]);
          }
        }
        // my tickets
        this.myTicketGrid = new MatTableDataSource<TicketModel>(myTickets); // new MatTableDataSource<Response>(data);
        this.myTicketGrid.paginator = this.myTicketPaginator;
        // appartments tickets
        this.ticketGrid = new MatTableDataSource<TicketModel>(tickets); // new MatTableDataSource<Response>(data);
        this.ticketGrid.paginator = this.paginator;
      }

    });
  }

  onClickCreate() {
    this.router.navigate(['ticket/create']);
  }

  onEdit(index, row) {
    this.appService.selectedTicketIndex = index;
    this.router.navigate(['ticket/create']);
  }

  onView(index, row) {
    this.appService.selectedTicketIndex = index;
    this.router.navigate(['ticket/info']);
  }

  onDelete(row) {
    console.log(row);
  }

}
