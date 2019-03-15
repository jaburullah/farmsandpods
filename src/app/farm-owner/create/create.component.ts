import {AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import {Router} from '@angular/router';
import {AppServiceService} from '../../service/app-service.service';
import {NotificationsService} from 'angular2-notifications';
import {bufferCount} from 'rxjs/internal/operators';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';

export class GeneratorInfo {
  _data: any;
  constructor(data) {
    this._data = data;
  }
  getCapacity() {
    return this._data.capacity;
  }
  getVendor() {
    return this._data.vendor;
  }
  getSerialNumber() {
    return this._data.serialNumber;
  }
  getContactNumber() {
    return this._data.contactNumber;
  }
}

export class GeneratorAMCDetails {
  _data: any;
  constructor(data) {
    this._data = data;
  }
  getVendor() {
    return this._data.vendor;
  }
  getCost() {
    return this._data.cost;
  }
  getServiceDueDate() {
    return this._data.serviceDueDate;
  }
  getExpiryDate() {
    return this._data.expiryDate;
  }
}

export class GeneratorDetails {
    // _data: any;
    // sno = 0;
    // constructor(data, sno) {
    //   this._data = data;
    //   this.sno = sno;
    // }
    // getGeneratorInfo() {
    //   return new GeneratorInfo(this._data.generatorInfo);
    // }
    // getGeneratorAMCDetails() {
    //   return new GeneratorAMCDetails(this._data.amcDetails);
    // }
    // getSNO() {
    //   return this.sno;
    // }
  generatorDetails: {};
  liftDetails: {};
}

export class LiftDetails {
  // _data: any;
  // sno = 0;
  // constructor(data, sno) {
  //   this._data = data;
  //   this.sno = sno;
  // }
  // getLiftInfo() {
  //   return new GeneratorInfo(this._data.liftInfo);
  // }
  // getLiftAMCDetails() {
  //   return new GeneratorAMCDetails(this._data.amcDetails);
  // }
  // getSNO() {
  //   return this.sno;
  // }
}

export class Appartement {
  // _data: any;
  // constructor(data) {
  //   this._data = data;
  // }
  // // generator
  // getGeneratorDetails() {
  //   const a: GeneratorDetails[] = [];
  //   const d = this._data.generatorDetails;
  //   for (let i = 0; i < d.length; i++) {
  //     a.push(new GeneratorDetails(d[i], i + 1));
  //   }
  //   return a;
  // }
  // addGeneratorDetails(generator) {
  //   this._data.generatorDetails.push(generator);
  // }
  // deleteGeneratorDetails(index) {
  //   this._data.generatorDetails.splice(index, 1);
  // }
  // // lift
  // getLiftDetails() {
  //   const a: LiftDetails[] = [];
  //   const d = this._data.liftDetails;
  //   for (let i = 0; i < d.length; i++) {
  //     a.push(new LiftDetails(d[i], i + 1));
  //   }
  //   return a;
  // }
  // addLiftDetails(lift) {
  //   this._data.liftDetails.push(lift);
  // }
  // deleteLiftDetails(index) {
  //   this._data.liftDetails.splice(index, 1);
  // }
  // toData() {
  //   return JSON.stringify(this._data);
  // }
  // // basic info
  // getName() {
  //   return this._data.name;
  // }
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, AfterViewInit {
  moreInfoTableColumns: string[] = ['sno', 'Details', 'action' ];
  displayedColumns1: string[] = ['sno', 'capacity', 'action'];
  GeneratorDetailsData: GeneratorDetails[] = [];
  liftDetailsData: LiftDetails[] = [];
  generatorDetailsForm: FormGroup;
  liftDetailsForm: FormGroup;
  farmOwnerForm: FormGroup;
  data;
  userName;
  selectedFarmOwnerIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  sessionM;
  @ViewChild('farmownerform') farmownerform;
  @ViewChild('generatorform') generatorform;
  @ViewChild('liftform') liftform;
  @ViewChild('actionbutton', {read: ElementRef}) button: ElementRef;
  @ViewChild('appartementdelete', {read: ElementRef}) dialog: ElementRef;
  constructor(private modalService: NgbModal,
              private router: Router, private appService: AppServiceService,
              private notifyService: NotificationsService,
              private fb: FormBuilder,
              private session: SessionModel) {
    this.sessionM = this.session;
  }

  ngOnInit() {
    this.data = {
      generatorDetails: [],
      liftDetails: []
    };
    this.createFarmOwnerForm();
    // this.createGeneratorForm();
    // this.createLiftForm();
    // this.selectedFarmOwnerIndex = this.appService.selectedFarmOwnerIndex;
    // if (this.selectedFarmOwnerIndex >= 0) {
    //   const selectedAppartement = JSON.parse(JSON.stringify(this.appService.appartement[this.selectedFarmOwnerIndex]));

    //   this.GeneratorDetailsData = selectedAppartement.generatorDetails;
    //   this.liftDetailsData = selectedAppartement.liftDetails;

    //   this.data.generatorDetails = selectedAppartement.generatorDetails;
    //   this.data.liftDetails = selectedAppartement.liftDetails;
    //   // no
    //   delete selectedAppartement.generatorDetails;
    //   delete selectedAppartement.liftDetails;
    //   // no
    //   this.basicInfoForm.setValue(selectedAppartement);
    // }

    this.selectedFarmOwnerIndex = this.appService.selectedFarmOwnerIndex;
    if (this.selectedFarmOwnerIndex >= 0) {
      const selectedFarmOwner = JSON.parse(JSON.stringify(this.appService.farmOwner[this.selectedFarmOwnerIndex]));
      // no
      this.userName = selectedFarmOwner.userName;
      this.farmOwnerForm.setValue(selectedFarmOwner);
    }

    this.errors = {
      name: 'Enter name of farm owner',
      contactNumber: 'Contact Number must be valid (10digits)',
      email: 'Email must be a valid email address (username@domain)',
      address: `Enter Address of farm owner`,
      pincode: 'pincode must be valid (6digits)',
      userName: 'Enter login user name',
      password: 'Enter login password',
    };
  }
  ngAfterViewInit() {
    if (this.selectedFarmOwnerIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  createFarmOwnerForm() {
    this.farmOwnerForm = new FormGroup({
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      contactNumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', Validators.required),
      pincode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      dob: new FormControl(),
      bg: new FormControl(),
      image: new FormControl(),
      userName: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      status: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      isDeleted: new FormControl()
    });
  }


  onSubmitFarmOwnerInfo() {
    if (!this.farmOwnerForm.valid) {
      // for (const p in this.farmOwnerForm.controls) {
      //   if (this.farmOwnerForm.controls[p].invalid) {
      //     console.log(this.farmOwnerForm.controls[p]);
      //   }
      // }
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.farmOwnerForm.value;
    postData.isDeleted = false;
    // this.farmOwnerForm.reset();
    this.farmownerform.resetForm();

    this.appService.saveFarmOwner(postData).subscribe((data) => {

      if (this.selectedFarmOwnerIndex >= 0) {
        this.appService.farmOwner.splice(this.selectedFarmOwnerIndex, 1, postData);
        this.appService.selectedFarmOwnerIndex = -1;
        this.selectedFarmOwnerIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Farm Owner ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.farmOwner.push(postData);
        this.notifyService.success(`Farm Owner ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedFarmOwnerIndex = -1;
    this.selectedFarmOwnerIndex = -1;
    this.router.navigate(['/farmOwner/manage']);
  }

  onClickDelete(appartementDelete) {
    this.confirmDialog = this.modalService.open(appartementDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  onClickOk() {
    const postData = this.farmOwnerForm.value;
    this.appService.deleteFarmOwner(postData).subscribe((data) => {
      this.appService.farmOwner.splice(this.selectedFarmOwnerIndex, 1);
      this.notifyService.success(`Farm Owner ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.farmownerform.resetForm();
      this.appService.selectedFarmOwnerIndex = -1;
      this.selectedFarmOwnerIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
