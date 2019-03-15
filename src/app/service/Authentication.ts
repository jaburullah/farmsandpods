import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {AppServiceService} from './app-service.service';
import {SessionModel} from '../model/Session';

@Injectable()
export class AuthenticationResolve implements Resolve<any> {
  constructor(private  appService: AppServiceService, private session: SessionModel) {}
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot,
  ): Observable<any> {
    const postData = {
      email: this.session.getEmail(),
      password: this.session.getPassword(),
      shouldRememberUserNameAndPassword: this.session.shouldRememberUserNameAndPassword()
    };
    return this.appService.isAuthenticated(postData);
  }
}
