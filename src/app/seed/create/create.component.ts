import {AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import {Router} from '@angular/router';
import {AppServiceService} from '../../service/app-service.service';
import {NotificationsService} from 'angular2-notifications';
import {bufferCount} from 'rxjs/internal/operators';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, AfterViewInit {


  seedForm: FormGroup;
  data;
  userName;
  selectedSeedIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  farmOnwer;
  sessionM;
  @ViewChild('seedform') seedform;

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
    this.createSeedForm();
    this.selectedSeedIndex = this.appService.selectedSeedIndex;
    if (this.selectedSeedIndex >= 0) {
      const selectedFarm = JSON.parse(JSON.stringify(this.appService.seed[this.selectedSeedIndex]));
      // no
      this.seedForm.setValue(selectedFarm);
    }

    this.errors = {
      name: 'Enter name of seed',
      contactNumber: 'Contact Number must be valid (10digits)',
      email: 'Email must be a valid email address (username@domain)',
      address: `Enter Address of farm owner`,
      pincode: 'pincode must be valid (6digits)',
      userName: 'Enter login user name',
      password: 'Enter login password',
    };
  }
  ngAfterViewInit() {
    if (this.selectedSeedIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  createSeedForm() {
    this.seedForm = new FormGroup({
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      category: new FormControl(),
      plantType: new FormControl(),
      growingAge: new FormControl(),
      healthTips: new FormControl(),
      minReqArea: new FormControl(),
      maxReqArea: new FormControl(),
      value: new FormControl(),
      count: new FormControl(),
      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      isDeleted: new FormControl(),
    });
  }


  onSubmitFarmInfo() {
    if (!this.seedForm.valid) {
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.seedForm.value;
    postData.isDeleted = false;
    this.seedform.resetForm();

    this.appService.saveSeed(postData).subscribe((data) => {

      if (this.selectedSeedIndex >= 0) {
        this.appService.seed.splice(this.selectedSeedIndex, 1, postData);
        this.appService.selectedSeedIndex = -1;
        this.selectedSeedIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Seed ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.seed.push(postData);
        this.notifyService.success(`Seed ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedSeedIndex = -1;
    this.selectedSeedIndex = -1;
    this.router.navigate(['/seeds/manage']);
  }

  onClickDelete(deleteData) {
    this.confirmDialog = this.modalService.open(deleteData, {ariaLabelledBy: 'modal-basic-title'});
  }

  onChangePrimary(data) {
    console.log(data);
  }

  onClickOk() {
    const postData = this.seedForm.value;
    this.appService.deleteSeed(postData).subscribe((data) => {
      this.appService.seed.splice(this.selectedSeedIndex, 1);
      this.notifyService.success(`Seed ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.seedform.resetForm();
      this.appService.selectedSeedIndex = -1;
      this.selectedSeedIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
