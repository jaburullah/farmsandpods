import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {SessionModel} from '../model/Session';
import {switchMap, tap} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {Appartement} from '../model/AppartmentModel';
import {FarmOwner} from '../model/FarmOwnerModel';
import {Farm} from '../model/FarmModel';
import {Seed} from '../model/SeedModel';
import {PodOwner} from '../model/PodOwnerModel';
import {Pod} from '../model/PodModel';
import {Bed} from '../model/BedModel';
import {environment} from '../../environments/environment.prod';

// import 'rxjs/add/operator/toPromise';

export class Response {
  data: {
    msg: string;
    // session: string;
  };
  success: boolean;
}

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class AppServiceService {
  rootURL = '';
  // rootURL = 'https://samappartement.herokuapp.com/';
  appInfo;
  appartement: Appartement[] = [];
  farmOwner: FarmOwner[] = [];
  farm: Farm[] = [];
  seed: Seed[] = [];
  podOwner: PodOwner[] = [];
  pod: Pod[] = [];
  bed: Bed[] = [];
  manager: any[] = [];
  tenant: any[] = [];
  ticket: any[] = [];
  selectedAppartementIndex: number;
  selectedFarmOwnerIndex: number;
  selectedFarmIndex: number;
  selectedSeedIndex: number;
  selectedPodOwnerIndex: number;
  selectedPodIndex: number;
  selectedBedIndex: number;
  selectedManagerIndex: number;
  selectedTenantIndex: number;
  selectedTicketIndex: number;
  constructor(private http: HttpClient, private session: SessionModel, private router: Router) {
    // if (true) {
      this.rootURL = document.location.origin + '/';
    // } else {
      this.rootURL = 'http://localhost:8084/';
    // }
    console.log(document.location.origin);
  }
  isAuthenticated(data): Observable<any> {
    // if (!data.email) {
    //   data.email = this.session.getEmail();
    //   data.password = this.session.getPassword();
    // }
    data.hashKey = this.session.getHashKey();
    return this.http.post<Response>(`${this.rootURL}login?session=false&login=true`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  logIn(data): Observable<any> {
    // if (!data.email) {
    //   data.email = this.session.getEmail();
    //   data.password = this.session.getPassword();
    // }
    data.hashKey = this.session.getHashKey();
    return this.http.post<Response>(`${this.rootURL}login?session=false&login=true`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  logOut(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}logout?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getDashboardDetails(): Observable<any> {
    // if (this.appartement.length === 0) {
      return this.http.get<Response>(`${this.rootURL}dashboardDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, ''))
      );
    //
    // } else {
    //   return of({});
    // }
  }

  saveAppartement(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveAppartement?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getAppartement(): Observable<any> {
    if (this.appartement.length === 0) {
      return this.http.get<any>(`${this.rootURL}appartementDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          if (this.session.isManager()) {
            const primary = res.data.primary || [];
            res.data = primary.concat(res.data.secondary || []);
          }
          return this.callBack(res, 'appartement');
        })
      );
    } else {
      return of(this.appartement);
    }
  }

  deleteAppartement(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteAppartement?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveFarmOwner(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveFarmOwner?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getFarmOwner(): Observable<any> {
    if (this.farmOwner.length === 0) {
      return this.http.get<any>(`${this.rootURL}farmOwnerDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          return this.callBack(res, 'farmOwner');
        })
      );
    } else {
      return of(this.farmOwner);
    }
  }

  deleteFarmOwner(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteFarmOwner?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveFarm(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveFarm?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getFarm(): Observable<any> {
    if (this.farm.length === 0) {
      return this.http.get<any>(`${this.rootURL}farmDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          return this.callBack(res, 'farm');
        })
      );
    } else {
      return of(this.farm);
    }
  }

  deleteFarm(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteFarm?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveSeed(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveSeed?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getSeed(): Observable<any> {
    if (this.seed.length === 0) {
      return this.http.get<any>(`${this.rootURL}SeedDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          return this.callBack(res, 'seed');
        })
      );
    } else {
      return of(this.seed);
    }
  }

  deleteSeed(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteSeed?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  savePodOwner(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}savePodOwner?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getPodOwner(): Observable<any> {
    if (this.podOwner.length === 0) {
      return this.http.get<any>(`${this.rootURL}podOwnerDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          return this.callBack(res, 'podOwner');
        })
      );
    } else {
      return of(this.podOwner);
    }
  }

  deletePodOwner(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deletePodOwner?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  savePod(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}savePod?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getPod(): Observable<any> {
    if (this.pod.length === 0) {
      return this.http.get<any>(`${this.rootURL}podDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          return this.callBack(res, 'pod');
        })
      );
    } else {
      return of(this.pod);
    }
  }

  deletePod(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deletePod?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveBed(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveBed?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getBed(): Observable<any> {
    if (this.bed.length === 0) {
      return this.http.get<any>(`${this.rootURL}bedDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap((res) => {
          return this.callBack(res, 'bed');
        })
      );
    } else {
      return of(this.bed);
    }
  }

  deleteBed(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteBed?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveManager(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveManager?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getManager(): Observable<any[]> {
    if (this.manager.length === 0) {
      return this.http.get<Response>(`${this.rootURL}allManagerDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'manager'))
      );
    } else {
      return of(this.manager);
    }
  }

  deleteManager(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteManager?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveTenant(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveTenant?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getTenant(): Observable<any[]> {
    if (this.tenant.length === 0) {
      return this.http.get<Response>(`${this.rootURL}allTenantDetails?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'tenant'))
      );
    } else {
      return of(this.tenant);
    }
  }

  deleteTenant(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteTenant?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  saveTicket(data): Observable<any> {
    return this.http.post<Response>(`${this.rootURL}saveTicket?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  getTicket(): Observable<any[]> {
    if (this.ticket.length === 0) {
      return this.http.get<Response>(`${this.rootURL}allTickets?session=${this.session.getHashKey()}`).pipe(
        switchMap(res => this.callBack(res, 'ticket'))
      );
    } else {
      return of(this.ticket);
    }
  }

  deleteTicket(data): Observable<Response[]> {
    return this.http.post<Response>(`${this.rootURL}deleteTicket?session=${this.session.getHashKey()}`, data).pipe(
      switchMap(res => this.callBack(res, null))
    );
  }

  callBack(res, key) {
    if (!res.success) {
      // this.a.onShow();
      this.router.navigate(['login']);
      throw (new Error(res.data.msg));
    }
    if (key) {
      this[key] = res.data;
    }
    return of(res.data);
  }
}
