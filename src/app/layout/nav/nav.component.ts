import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceService} from '../../service/app-service.service';
import {Router} from '@angular/router';
import {SessionModel} from '../../model/Session';
import {NotificationsService} from 'angular2-notifications';
import {SidenavComponent} from '../sidenav/sidenav.component';
import {DashboardComponent} from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, AfterViewInit {
  logoutDialog: NgbModalRef;
  closeResult: string;
  userInfo;
  @ViewChild('lastvisted') lastvisted: ElementRef;
  @ViewChild(SidenavComponent) sideComp: SidenavComponent;
  constructor(private modalService: NgbModal,
              private appService: AppServiceService,
              private route: Router,
              private session: SessionModel,
              private notifyService: NotificationsService) {
  }

  ngOnInit() {
  }

  open(content) {
    this.logoutDialog = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngAfterViewInit() {
    this.lastvisted.nativeElement.textContent = this.session.getLastVisited(); // this.session.getLastVisited();
  }
  onLogout() {
    this.logoutDialog.dismiss();
    const postData = {
      email: this.session.getEmail(),
      password: this.session.getPassword(),
      shouldRememberUserNameAndPassword: this.session.shouldRememberUserNameAndPassword()
    };
    this.appService.logOut(postData).subscribe((data) => {
      if (data.logout) {
        this.session.clearSession();
        this.route.navigate(['/login']);
      } else {
        this.notifyService.error('Failed', 'Logout action failed');
      }
    });
  }

}
