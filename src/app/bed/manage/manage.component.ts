import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {Pod} from '../../model/PodModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'type', 'area', 'action'];
  // bedGrid: Response[] = [];
  bedGrid = new MatTableDataSource<Pod>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  sessionM;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.sessionM = this.session;
    this.appService.selectedFarmIndex = -1;
  }

  ngOnInit() {
    this.appService.getBed().subscribe((data) => {
      // if (this.session.isAdmin()) {
        this.bedGrid = new MatTableDataSource<Pod>(data); // new MatTableDataSource<Response>(data);
        this.bedGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.bedGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.bedGrid.paginator = this.paginator;
      // }
    });
  }

  onClickCreate() {
    this.router.navigate(['beds/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedBedIndex = index;
    this.router.navigate(['beds/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
