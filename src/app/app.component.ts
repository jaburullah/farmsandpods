import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AppServiceService} from './service/app-service.service';
import {SessionModel} from './model/Session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public options = {
    position: ['top', 'right'],
    icon: {
      error: './src/favicon.ico'
    },
    timeOut: 5000,
    animate: 'scale',
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: false
  };
  constructor() {
  }
}
