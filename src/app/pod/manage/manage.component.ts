import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {Bed} from '../../model/BedModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'podNumber', 'totalArea', 'growingArea', 'commonArea', 'action'];
  // podGrid: Response[] = [];
  podGrid = new MatTableDataSource<Bed>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  sessionM;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.sessionM = this.session;
    this.appService.selectedFarmIndex = -1;
  }

  ngOnInit() {
    this.appService.getPod().subscribe((data) => {
      // if (this.session.isAdmin()) {
        this.podGrid = new MatTableDataSource<Bed>(data); // new MatTableDataSource<Response>(data);
        this.podGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.podGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.podGrid.paginator = this.paginator;
      // }
    });
  }

  onClickCreate() {
    this.router.navigate(['pods/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedPodIndex = index;
    this.router.navigate(['pods/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
