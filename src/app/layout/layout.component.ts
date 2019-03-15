import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { LayoutComponentModule } from './layout-component.module';
import {AppServiceService} from '../service/app-service.service';
import {SessionModel} from '../model/Session';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {NavComponent} from './nav/nav.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {DashboardComponent} from '../dashboard/dashboard.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChildren('lastvisted') lastvisted: ElementRef;
  @ViewChild(NavComponent) navComp: NavComponent;
  @ViewChild(DashboardComponent) dashboard: DashboardComponent;
  loginStatus: boolean;
  constructor(private route: Router,
              private activeRoute: ActivatedRoute,
              private appService: AppServiceService,
              private session: SessionModel,
              private notifyService: NotificationsService) {
    const postData = {
      email: this.session.getEmail(),
      password: this.session.getPassword(),
      shouldRememberUserNameAndPassword: this.session.shouldRememberUserNameAndPassword()
    };
  }

  ngOnInit() {
    this.activeRoute.data
      .subscribe((res) => {
        const data = res.data;
          if (data.hashKey) {
            this.session.init(data);
            this.appService.appInfo = data.appInfo;
            // k
            console.log(this.session.getEmail());
            console.log(`Admin: ${this.session.isAdmin()}`);
            console.log(`Manager: ${this.session.isManager()}`);
            console.log(`Tenant: ${this.session.isTenant()}`);
          } else {
            this.route.navigate(['login']);
            this.notifyService.error('Login Failed', 'Invalid Session');
          }
      });
  }

  ngAfterViewInit() {
    // console.log(this.navComp);
  }

}
