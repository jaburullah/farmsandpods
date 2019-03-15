import {ErrorHandler, EventEmitter, Injectable, Injector, Output, TemplateRef, ViewChild} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}
  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        console.log((`${error.status} - ${error.message}`));
      } else {
        // Handle Http Error (error.status === 403, 404...)
        console.log((`${error.status} - ${error.message}`));
      }
    } else {
      console.log((`${error.message}`));
    }
    // private _service: NotificationsService
    const a = this.injector.get(NotificationsService);
    a.error('Error !!', error.message);
  }
  public get router(): Router {
    // this creates router property on your service.
    return this.injector.get(Router);
  }
}
