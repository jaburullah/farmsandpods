import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../../service/app-service.service';
import { NotificationsService } from 'angular2-notifications';
import { bufferCount } from 'rxjs/internal/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SessionModel } from '../../model/Session';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, AfterViewInit {


  bedForm: FormGroup;
  data;
  userName;
  selectedBedIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  farm;
  pod;
  seed;
  sessionM;
  @ViewChild('bedform') bedform;

  @ViewChild('actionbutton', { read: ElementRef }) button: ElementRef;
  @ViewChild('appartementdelete', { read: ElementRef }) dialog: ElementRef;
  constructor(private modalService: NgbModal,
    private router: Router, private appService: AppServiceService,
    private notifyService: NotificationsService,
    private fb: FormBuilder,
    private session: SessionModel) {
    this.sessionM = this.session;
  }

  ngOnInit() {
    this.createBedForm();
    this.appService.getFarm().subscribe((farmsData) => {
      this.farm = farmsData;
      this.appService.getPod().subscribe((podData) => {
        this.pod = podData;
        this.appService.getSeed().subscribe((seedData) => {
          this.seed = seedData;
          this.selectedBedIndex = this.appService.selectedBedIndex;
          if (this.selectedBedIndex >= 0) {
            const selectedPod = JSON.parse(JSON.stringify(this.appService.bed[this.selectedBedIndex]));
            // no
            this.bedForm.setValue(selectedPod);
          }
        });
      });
    });

    this.errors = {
      farmID: 'Select Farm',
      name: 'Enter name of bed',
      podID: 'Select Pod',
    };
  }
  ngAfterViewInit() {
    if (this.selectedBedIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  onChangePodOwner() {

  }

  onChangeFarm() {

  }

  createBedForm() {
    this.bedForm = new FormGroup({
      _id: new FormControl(),
      farmID: new FormControl('', Validators.required),
      podID: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      type: new FormControl(),
      area: new FormControl(),
      seedID: new FormControl('', [Validators.required]),

      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      isDeleted: new FormControl(),
    });
  }


  onSubmitFarmInfo() {
    if (!this.bedForm.valid) {
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.bedForm.value;
    postData.isDeleted = false;
    this.bedform.resetForm();

    this.appService.saveBed(postData).subscribe((data) => {

      if (this.selectedBedIndex >= 0) {
        this.appService.bed.splice(this.selectedBedIndex, 1, postData);
        this.appService.selectedBedIndex = -1;
        this.selectedBedIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Bed ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.bed.push(postData);
        this.notifyService.success(`Bed ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedBedIndex = -1;
    this.selectedBedIndex = -1;
    this.router.navigate(['/beds/manage']);
  }

  onClickDelete(deleteData) {
    this.confirmDialog = this.modalService.open(deleteData, { ariaLabelledBy: 'modal-basic-title' });
  }

  onChangePrimary(data) {
    console.log(data);
  }

  onClickOk() {
    const postData = this.bedForm.value;
    this.appService.deleteBed(postData).subscribe((data) => {
      this.appService.pod.splice(this.selectedBedIndex, 1);
      this.notifyService.success(`Bed ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.bedform.resetForm();
      this.appService.selectedBedIndex = -1;
      this.selectedBedIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
