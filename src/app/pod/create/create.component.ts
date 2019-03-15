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


  podForm: FormGroup;
  data;
  userName;
  selectedPodIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  farm;
  podOwner;
  sessionM;
  @ViewChild('podform') podform;

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
    this.createPodForm();


    this.appService.getFarm().subscribe((farmsData) => {
      this.farm = farmsData;
      this.appService.getPodOwner().subscribe((podOwnersData) => {
        this.podOwner = podOwnersData;
        this.selectedPodIndex = this.appService.selectedPodIndex;
        if (this.selectedPodIndex >= 0) {
          const selectedPod = JSON.parse(JSON.stringify(this.appService.pod[this.selectedPodIndex]));
          // no
          this.podForm.setValue(selectedPod);
        }

      });

    });



    this.errors = {
      farmID: 'Select Farm Owner',
      name: 'Enter name of seed',
      podNumber: 'Enter pod number',
      podOwnerID: 'Select Pod Owner',
    };
  }
  ngAfterViewInit() {
    if (this.selectedPodIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }

  onChangePodOwner() {

  }

  onChangeFarm() {

  }

  createPodForm() {
    this.podForm = new FormGroup({
      _id: new FormControl(),
      farmID: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      podNumber: new FormControl('', Validators.required),
      totalArea: new FormControl(),
      growingArea: new FormControl(),
      commonArea: new FormControl(),
      podOwnerID: new FormControl('', [Validators.required]),
      subscriptionAmount: new FormControl(),
      latitude: new FormControl(),
      longitude: new FormControl(),

      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      isDeleted: new FormControl(),
    });
  }


  onSubmitFarmInfo() {
    if (!this.podForm.valid) {
      this.notifyService.info(`Enter basic info`);
      return;
    }
    const postData = this.podForm.value;
    postData.isDeleted = false;
    this.podform.resetForm();

    this.appService.savePod(postData).subscribe((data) => {

      if (this.selectedPodIndex >= 0) {
        this.appService.pod.splice(this.selectedPodIndex, 1, postData);
        this.appService.selectedPodIndex = -1;
        this.selectedPodIndex = -1;
        this.button.nativeElement.textContent = 'Save';
        this.notifyService.success(`Pod ${postData.name} updated successfully`);
      } else {
        postData._id = data._id;
        this.appService.pod.push(postData);
        this.notifyService.success(`Pod ${postData.name} created successfully`);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedPodIndex = -1;
    this.selectedPodIndex = -1;
    this.router.navigate(['/pods/manage']);
  }

  onClickDelete(deleteData) {
    this.confirmDialog = this.modalService.open(deleteData, {ariaLabelledBy: 'modal-basic-title'});
  }

  onChangePrimary(data) {
    console.log(data);
  }

  onClickOk() {
    const postData = this.podForm.value;
    this.appService.deletePod(postData).subscribe((data) => {
      this.appService.pod.splice(this.selectedPodIndex, 1);
      this.notifyService.success(`Pod ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.podform.resetForm();
      this.appService.selectedPodIndex = -1;
      this.selectedPodIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
