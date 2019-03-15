import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {Appartement} from '../../model/AppartmentModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'noOfHouses', 'address', 'email', 'contact', 'action'];
  // appartementGrid: Response[] = [];
  appartementGrid = new MatTableDataSource<Appartement>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  sessionM;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.sessionM = this.session;
    this.appService.selectedAppartementIndex = -1;
  }

  ngOnInit() {
    this.appService.getAppartement().subscribe((data) => {
      // if (this.session.isAdmin()) {
        this.appartementGrid = new MatTableDataSource<Appartement>(data); // new MatTableDataSource<Response>(data);
        this.appartementGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.appartementGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.appartementGrid.paginator = this.paginator;
      // }
    });
  }

  onClickCreate() {
    this.router.navigate(['appartement/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedAppartementIndex = index;
    this.router.navigate(['appartement/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
