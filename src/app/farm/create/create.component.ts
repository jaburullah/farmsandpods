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


  farmForm: FormGroup;
  data;
  userName;
  selectedFarmIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  farmOnwer;
  sessionM;
  @ViewChild('farmform') farmform;

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
    this.createFarmForm();

    this.appService.getFarmOwner().subscribe((data) => {
      this.farmOnwer = data;

      this.selectedFarmIndex = this.appService.selectedFarmIndex;
      if (this.selectedFarmIndex >= 0) {
        const selectedFarm = JSON.parse(JSON.stringify(this.appService.farm[this.selectedFarmIndex]));
        // no
        this.farmForm.setValue(selectedFarm);
      }

    });

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
    if (this.selectedFarmIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  createFarmForm() {
    this.farmForm = new FormGroup({
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      area: new FormControl(),
      noOfPods: new FormControl(),
      singlePodsArea: new FormControl(),
      location: new FormControl(),
      latitude: new FormControl(),
      longitude: new FormControl(),
      ownerID: new FormControl('', [Validators.required]),

      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      status: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      isDeleted: new FormControl()
    });
  }


  onSubmitFarmInfo() {
    if (!this.farmForm.valid) {
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.farmForm.value;
    postData.isDeleted = false;
    this.farmform.resetForm();

    this.appService.saveFarm(postData).subscribe((data) => {

      if (this.selectedFarmIndex >= 0) {
        this.appService.farm.splice(this.selectedFarmIndex, 1, postData);
        this.appService.selectedFarmIndex = -1;
        this.selectedFarmIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Farm ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.farm.push(postData);
        this.notifyService.success(`Farm ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedFarmIndex = -1;
    this.selectedFarmIndex = -1;
    this.router.navigate(['/farms/manage']);
  }

  onClickDelete(deleteData) {
    this.confirmDialog = this.modalService.open(deleteData, {ariaLabelledBy: 'modal-basic-title'});
  }

  onChangePrimary(data) {
    console.log(data);
  }

  onClickOk() {
    const postData = this.farmForm.value;
    this.appService.deleteFarm(postData).subscribe((data) => {
      this.appService.farm.splice(this.selectedFarmIndex, 1);
      this.notifyService.success(`Farm ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.farmform.resetForm();
      this.appService.selectedFarmIndex = -1;
      this.selectedFarmIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
