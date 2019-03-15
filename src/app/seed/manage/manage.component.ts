import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService, Response} from '../../service/app-service.service';
import {Seed} from '../../model/SeedModel';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'category', 'plantType', 'growingAge', 'value', 'action'];
  // seedGrid: Response[] = [];
  seedGrid = new MatTableDataSource<Seed>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  sessionM;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.sessionM = this.session;
    this.appService.selectedFarmIndex = -1;
  }

  ngOnInit() {
    this.appService.getSeed().subscribe((data) => {
      // if (this.session.isAdmin()) {
        this.seedGrid = new MatTableDataSource<Seed>(data); // new MatTableDataSource<Response>(data);
        this.seedGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.seedGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.seedGrid.paginator = this.paginator;
      // }
    });
  }

  onClickCreate() {
    this.router.navigate(['seeds/create']);
  }

  onEdit(index, row) {
    // this.appService.selectedAppartement = row;
    this.appService.selectedSeedIndex = index;
    this.router.navigate(['seeds/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
