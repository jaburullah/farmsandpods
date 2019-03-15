import { Component, OnInit } from '@angular/core';
import {SessionModel} from '../../model/Session';
import {Appartement} from '../../model/AppartmentModel';
import {MatTableDataSource} from '@angular/material';
import {AppServiceService} from '../../service/app-service.service';
import {GeneratorDetails, LiftDetails} from '../create/create.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  moreInfoTableColumns: string[] = ['sno', 'details' ];
  GeneratorDetailsData: GeneratorDetails[] = [];
  liftDetailsData: LiftDetails[] = [];
  data;
  primaryManagers = [];
  secondaryManagers = [];
  constructor(private session: SessionModel, private appService: AppServiceService) {
    this.data = {};
  }

  ngOnInit() {
    console.log(this.session.getAppartement());
    this.appService.getAppartement().subscribe((data) => {
      console.log(data);
      this.GeneratorDetailsData = data[0].generatorDetails;
      this.liftDetailsData = data[0].liftDetails;
      this.primaryManagers = data[0].primaryManagers || [];
      this.secondaryManagers = data[0].secondaryManagers || [];
      this.data = data[0];
      // if (this.session.isAdmin()) {
      // this.appartementGrid = new MatTableDataSource<Appartement>(data); // new MatTableDataSource<Response>(data);
      // this.appartementGrid.paginator = this.paginator;
      // } else if (this.session.isManager()) {
      //   const appt = data.primary.concat(data.secondary);
      //   this.appartementGrid = new MatTableDataSource<Appartement>(appt); // new MatTableDataSource<Response>(data);
      //   this.appartementGrid.paginator = this.paginator;
      // }
    });
  }

}
