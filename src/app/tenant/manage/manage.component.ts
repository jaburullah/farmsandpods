import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {AppServiceService} from '../../service/app-service.service';
import {ManagerModel} from '../../model/ManagerModel';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'name', 'address', 'houseNo', 'email', 'contact', 'action'];
  // appartementGrid: Response[] = [];
  tenantGrid = new MatTableDataSource<ManagerModel>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private router: Router, private appService: AppServiceService) {
    this.appService.selectedTenantIndex = -1;
  }

  ngOnInit() {
    this.appService.getTenant().subscribe((data) => {
      this.tenantGrid = new MatTableDataSource<ManagerModel>(data); // new MatTableDataSource<Response>(data);
      this.tenantGrid.paginator = this.paginator;
    });
  }

  onClickCreate() {
    this.router.navigate(['tenant/create']);
  }

  onEdit(index, row) {
    this.appService.selectedTenantIndex = index;
    this.router.navigate(['tenant/create']);
  }

  onDelete(row) {
    console.log(row);
  }

}
