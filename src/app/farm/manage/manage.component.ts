import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {Farm} from '../../model/FarmModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'noOfPods', 'location', 'area', 'singlePodsArea', 'action'];
  // appartementGrid: Response[] = [];
  appartementGrid = new MatTableDataSource<Farm>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  sessionM;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.sessionM = this.session;
    this.appService.selectedFarmIndex = -1;
  }

  ngOnInit() {
    this.appService.getFarm().subscribe((data) => {
      // if (this.session.isAdmin()) {
        this.appartementGrid = new MatTableDataSource<Farm>(data); // new MatTableDataSource<Response>(data);
        this.appartementGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.appartementGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.appartementGrid.paginator = this.paginator;
      // }
    });
  }

  onClickCreate() {
    this.router.navigate(['farms/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedFarmIndex = index;
    this.router.navigate(['farms/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
