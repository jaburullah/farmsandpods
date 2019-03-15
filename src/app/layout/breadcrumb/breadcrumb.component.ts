import {Component, ElementRef, OnInit} from '@angular/core';
import {Router, ROUTES} from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = this.router.config;
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice( 2 );
    }
    titlee = titlee.split('/').pop();

    for ( let item = 0; item < this.listTitles.length; item++ ) {
      if ( this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }
}
