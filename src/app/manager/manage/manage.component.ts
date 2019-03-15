import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AppServiceService} from '../../service/app-service.service';
import {ManagerModel} from '../../model/ManagerModel';
import {Router} from '@angular/router';
import {SessionModel} from '../../model/Session';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'address', 'email', 'contact', 'action'];
  // appartementGrid: Response[] = [];
  managerGrid = new MatTableDataSource<ManagerModel>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasSession = false;
  constructor(private router: Router, private appService: AppServiceService, private session: SessionModel) {
    this.hasSession = this.session.hasSession;
    this.appService.selectedManagerIndex = -1;
  }

  ngOnInit() {
    this.appService.getManager().subscribe((data) => {
      this.managerGrid = new MatTableDataSource<ManagerModel>(data); // new MatTableDataSource<Response>(data);
      this.managerGrid.paginator = this.paginator;
    });
  }

  onClickCreate() {
    this.router.navigate(['manager/create']);
  }

  onEdit(index, row) {
    this.appService.selectedManagerIndex = index;
    this.router.navigate(['manager/create']);
  }

  onDelete(row) {
    console.log(row);
  }


}
