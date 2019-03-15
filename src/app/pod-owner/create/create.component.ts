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


  podOwnerForm: FormGroup;
  data;
  userName;
  selectedPodOwnerIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  farmOnwer;
  sessionM;
  @ViewChild('podownerform') podownerform;

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
    this.createPodOwnerForm();
    this.selectedPodOwnerIndex = this.appService.selectedPodOwnerIndex;
    if (this.selectedPodOwnerIndex >= 0) {
      const selecedPodOwner = JSON.parse(JSON.stringify(this.appService.podOwner[this.selectedPodOwnerIndex]));
      // no
      this.podOwnerForm.setValue(selecedPodOwner);
    }

    this.errors = {
      name: 'Enter name of seed',
      contactNumber: 'Contact Number must be valid (10digits)',
      email: 'Email must be a valid email address (username@domain)',
      address: `Enter Address of farm owner`,
      pincode: 'pincode must be valid (6digits)'
    };
  }
  ngAfterViewInit() {
    if (this.selectedPodOwnerIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  createPodOwnerForm() {
    this.podOwnerForm = new FormGroup({
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      fatherName: new FormControl(),
      dob: new FormControl(),
      contactNumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl(),
      pincode: new FormControl('', [Validators.maxLength(6)]),

      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      isDeleted: new FormControl(),
    });
  }


  onSubmitFarmInfo() {
    if (!this.podOwnerForm.valid) {
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.podOwnerForm.value;
    postData.isDeleted = false;
    this.podownerform.resetForm();

    this.appService.savePodOwner(postData).subscribe((data) => {

      if (this.selectedPodOwnerIndex >= 0) {
        this.appService.podOwner.splice(this.selectedPodOwnerIndex, 1, postData);
        this.appService.selectedPodOwnerIndex = -1;
        this.selectedPodOwnerIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Pod Owner ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.podOwner.push(postData);
        this.notifyService.success(`Pod Owner ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedPodOwnerIndex = -1;
    this.selectedPodOwnerIndex = -1;
    this.router.navigate(['/podOwner/manage']);
  }

  onClickDelete(deleteData) {
    this.confirmDialog = this.modalService.open(deleteData, {ariaLabelledBy: 'modal-basic-title'});
  }

  onChangePrimary(data) {
    console.log(data);
  }

  onClickOk() {
    const postData = this.podOwnerForm.value;
    this.appService.deletePodOwner(postData).subscribe((data) => {
      this.appService.podOwner.splice(this.selectedPodOwnerIndex, 1);
      this.notifyService.success(`Pod Owner ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.podownerform.resetForm();
      this.appService.selectedPodOwnerIndex = -1;
      this.selectedPodOwnerIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
