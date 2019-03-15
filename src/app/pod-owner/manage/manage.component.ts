import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {PodOwner} from '../../model/PodOwnerModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'dob', 'contactNumber', 'email', 'action'];
  // podOwnerGrid: Response[] = [];
  podOwnerGrid = new MatTableDataSource<PodOwner>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  sessionM;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.sessionM = this.session;
    this.appService.selectedFarmIndex = -1;
  }

  ngOnInit() {
    this.appService.getPodOwner().subscribe((data) => {
      // if (this.session.isAdmin()) {
        this.podOwnerGrid = new MatTableDataSource<PodOwner>(data); // new MatTableDataSource<Response>(data);
        this.podOwnerGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.podOwnerGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.podOwnerGrid.paginator = this.paginator;
      // }
    });
  }

  onClickCreate() {
    this.router.navigate(['podOwner/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedPodOwnerIndex = index;
    this.router.navigate(['podOwner/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
