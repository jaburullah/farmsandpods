import {Component, OnInit, ViewChild} from '@angular/core';
import {AppServiceService, Response} from '../service/app-service.service';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
// import {SessionModel} from '../model/session';
import {SessionModel} from '../model/Session';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment.prod';
import {NotificationsService} from 'angular2-notifications';
// import * as io from 'socket.io-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // session: SessionModel;
  loginForm: FormGroup;
  errors;
  private url = 'http://localhost:3000';
  // private socket;
  message: string;
  messages: string[] = [];
  @ViewChild('loginF') loginF;
  constructor(private appService: AppServiceService,
              private route: Router, private session: SessionModel,
              private notifyService: NotificationsService) {
    //this.socket = io(this.url);
    // this.getMessages()
    //   .subscribe((message: string) => {
    //     this.messages.push(message);
    //   });
  }
  // sendMessage(message) {
  //   this.socket.emit('new-message', message);
  // }
  // getMessages() {
  //   return Observable.create((observer) => {
  //     this.socket.on('new-message', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }
  ngOnInit() {
    this.createLoginForm();
    this.errors = {
      email: 'Email must be a valid email address (username@domain)',
      password: 'Enter password'
    };
    this.loginForm.setValue({
      email: this.session.getEmail(),
      password: this.session.getPassword(),
      shouldRememberUserNameAndPassword: this.session.shouldRememberUserNameAndPassword()
    });
  }

  createLoginForm() {
    this.loginForm = new FormGroup( {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      shouldRememberUserNameAndPassword: new FormControl()
    });
  }

  onSubmitLogin() {
    let postData = {};
    if (!this.loginForm.valid) {
      // for (const p in this.basicInfoForm.controls) {
      //   if (this.basicInfoForm.controls[p].invalid) {
      //     console.log(this.basicInfoForm.controls[p]);
      //   }
      // }
      // this.notifyService.info(`Enter basic info`);
      return;
    }
    postData = this.loginForm.value;
    this.appService.logIn(postData).subscribe((data) => {
      if (data.hashKey) {
        this.session.init(data);
        this.loginF.resetForm();
        this.route.navigate(['dashboard']);
      } else {
        this.notifyService.error('Login Failed', 'Invalid Email and Password');
      }
    });
  }

}
