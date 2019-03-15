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
  basicInfoForm: FormGroup;
  data;
  selectedAppartementIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  sessionM;
  @ViewChild('basicinfoform') basicinfoform;
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
    this.createBasicInfoForm();
    this.createGeneratorForm();
    this.createLiftForm();
    this.selectedAppartementIndex = this.appService.selectedAppartementIndex;
    if (this.selectedAppartementIndex >= 0) {
      const selectedAppartement = JSON.parse(JSON.stringify(this.appService.appartement[this.selectedAppartementIndex]));

      this.GeneratorDetailsData = selectedAppartement.generatorDetails;
      this.liftDetailsData = selectedAppartement.liftDetails;

      this.data.generatorDetails = selectedAppartement.generatorDetails;
      this.data.liftDetails = selectedAppartement.liftDetails;
      // no
      delete selectedAppartement.generatorDetails;
      delete selectedAppartement.liftDetails;
      // no
      this.basicInfoForm.setValue(selectedAppartement);
    }
    this.errors = {
      name: 'Enter name of Appartement',
      noOfHouses: `Enter No.of Houses in Appartement`,
      address: `Enter Address of Appartement`,
      email: 'Email must be a valid email address (username@domain)',
      contactNumber: 'Contact Number must be valid (10digits)',
      generatorVendor: 'Enter generator vendor',
      generatorAMCVendor: 'Enter generator AMC vendor',
      liftVendor: 'Enter lift vendor',
      liftAMCVendor: 'Enter lift AMC vendor',
    };
  }
  ngAfterViewInit() {
    if (this.selectedAppartementIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  createBasicInfoForm() {
    this.basicInfoForm = new FormGroup( {
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      noOfHouses: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      presidentEmail: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      // stp
      stpVendor: new FormControl(),
      stpContactNumber: new FormControl(),
      // other
      noOfChairs: new FormControl(),
      noOfTables: new FormControl(),
      noOfMics: new FormControl(),
      isDeleted: new FormControl(),
      // generatorDetails: this.gen,
      // liftDetails: this.lift
    });
  }

  createGeneratorForm() {
    this.generatorDetailsForm = new FormGroup( {
      generatorInfo: new FormGroup({
        vendor: new FormControl('', Validators.required),
        capacity: new FormControl(),
        serialNumber: new FormControl(),
        contactNumber: new FormControl(),
      }),
      amcDetails: new FormGroup({
        vendor: new FormControl('', Validators.required),
        cost: new FormControl(),
        serviceDueDate: new FormControl(),
        expiryDate: new FormControl(),
      })
    });
  }

  createLiftForm() {
    this.liftDetailsForm = new FormGroup( {
      liftInfo: new FormGroup({
        vendor: new FormControl('', Validators.required),
        serialNumber: new FormControl(),
        contactNumber: new FormControl(),
      }),
      amcDetails: new FormGroup({
        vendor: new FormControl('', Validators.required),
        cost: new FormControl(),
        serviceDueDate: new FormControl(),
        expiryDate: new FormControl(),
      })
    });
  }

  onSubmitGenerator() {
    if (!this.generatorDetailsForm.valid) {
      return;
    }
    this.data.generatorDetails.push(this.generatorDetailsForm.value);
    const newGenerator = [];
    for (let i = 0; i < this.data.generatorDetails.length; i++) {
      newGenerator.push(this.data.generatorDetails[i]);
    }
    this.GeneratorDetailsData = newGenerator;
    // this.generatorDetailsForm.reset();
    this.generatorform.resetForm();
  }

  onDeleteGeneratorDetails(index) {
    this.data.generatorDetails.splice(index, 1);
    const newGenerator = [];
    for (let i = 0; i < this.data.generatorDetails.length; i++) {
      newGenerator.push(this.data.generatorDetails[i]);
    }
    this.GeneratorDetailsData = newGenerator;
  }

  onSubmitLift() {
    if (!this.liftDetailsForm.valid) {
      return;
    }
    this.data.liftDetails.push(this.liftDetailsForm.value);
    const newLift = [];
    for (let i = 0; i < this.data.liftDetails.length; i++) {
      newLift.push(this.data.liftDetails[i]);
    }
    this.liftDetailsData = newLift;
    // this.liftDetailsForm.reset();
    this.liftform.resetForm();
  }

  onDeleteLiftDetails(index) {
    this.data.liftDetails.splice(index, 1);
    const newLift = [];
    for (let i = 0; i < this.data.liftDetails.length; i++) {
      newLift.push(this.data.liftDetails[i]);
    }
    this.liftDetailsData = newLift;
  }

  onSubmitBasicInfo() {
    if (!this.basicInfoForm.valid) {
      // for (const p in this.basicInfoForm.controls) {
      //   if (this.basicInfoForm.controls[p].invalid) {
      //     console.log(this.basicInfoForm.controls[p]);
      //   }
      // }
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.basicInfoForm.value;
    postData.isDeleted = false;
    // this.basicInfoForm.reset();
    this.basicinfoform.resetForm();
    postData.generatorDetails = this.data.generatorDetails;
    postData.liftDetails = this.data.liftDetails;
    this.appService.saveAppartement(postData).subscribe((data) => {
      this.GeneratorDetailsData = [];
      this.liftDetailsData = [];
      if (this.selectedAppartementIndex >= 0) {
        this.appService.appartement.splice(this.selectedAppartementIndex, 1, postData);
        this.appService.selectedAppartementIndex = -1;
        this.selectedAppartementIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Appartment ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.appartement.push(postData);
        this.notifyService.success(`Appartment ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedAppartementIndex = -1;
    this.selectedAppartementIndex = -1;
    this.router.navigate(['/appartement/manage']);
  }

  onClickDelete(appartementDelete) {
    this.confirmDialog = this.modalService.open(appartementDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  onClickOk() {
    const postData = this.basicInfoForm.value;
    this.appService.deleteAppartement(postData).subscribe((data) => {
      this.appService.appartement.splice(this.selectedAppartementIndex, 1);
      this.notifyService.success(`Appartment ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.basicinfoform.resetForm();
      this.GeneratorDetailsData = [];
      this.liftDetailsData = [];
      this.appService.selectedAppartementIndex = -1;
      this.selectedAppartementIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
