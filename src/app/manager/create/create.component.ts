import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceService} from '../../service/app-service.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, AfterViewInit {
  managerInfoForm: FormGroup;
  selectedManagerIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  email;
  appartements;
  appartementsPrimary;
  appartementsSecondary;
  @ViewChild('managerform') managerform;
  @ViewChild('actionbutton', {read: ElementRef}) button: ElementRef;
  @ViewChild('managerdelete', {read: ElementRef}) dialog: ElementRef;
  constructor(private modalService: NgbModal,
              private router: Router, private appService: AppServiceService,
              private notifyService: NotificationsService,
              private fb: FormBuilder) { }
  ngOnInit() {
    this.errors = {
      name: 'Enter name of Manager',
      address: `Enter Address of Manager`,
      email: 'Email must be a valid email address (username@domain)',
      mobileNo: 'Mobile Number must be valid (10digits)',
      password: 'Enter login password'
    };
    this.createBasicInfoForm();
    this.appService.getAppartement().subscribe((data) => {
      this.appartements = data;
      this.appartementsPrimary = data;
      this.appartementsSecondary = data;
      this.selectedManagerIndex = this.appService.selectedManagerIndex;
      if (this.selectedManagerIndex >= 0) {
        const selectedManager = JSON.parse(JSON.stringify(this.appService.manager[this.selectedManagerIndex]));
        this.email = selectedManager.email;
        this.managerInfoForm.setValue(selectedManager);
      }
    });
  }
  ngAfterViewInit() {
    if (this.selectedManagerIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }
  createBasicInfoForm() {
    this.managerInfoForm = new FormGroup( {
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      address: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      primaryAppartements: new FormControl(),
      secondaryAppartements: new FormControl(),
      // other
      addressProof: new FormControl(),
      panCard: new FormControl(),
      voterId: new FormControl(),
      roles: new FormControl(),
      isDeleted: new FormControl()
    });
  }
  onChangePrimary(data) {
    this.appartementsSecondary = this.appartements;
    const primaryAppartments = this.managerInfoForm.controls.primaryAppartements.value || [];
    this.appartementsSecondary = this.appartementsSecondary.filter(x =>  {
      const ind = primaryAppartments.indexOf(x._id);
      return ind === -1;
    });
  }
  onChangeSecondary(data) {
    this.appartementsPrimary = this.appartements;
    const secondaryAppartements = this.managerInfoForm.controls.secondaryAppartements.value || [];
    this.appartementsPrimary = this.appartementsPrimary.filter(x =>  {
      const ind = secondaryAppartements.indexOf(x._id);
      return ind === -1;
    });

  }
  onSubmitBasicInfo() {
    if (!this.managerInfoForm.valid) {
      this.notifyService.info(`Enter manager info`);
      return;
    }
    const postData = this.managerInfoForm.value;
    postData.isDeleted = false;
    postData.roles = ['manager'];
    this.appService.saveManager(postData).subscribe((data) => {
      if (data.action) {
        this.appartementsPrimary = this.appartements;
        this.appartementsSecondary = this.appartements;
        if (this.selectedManagerIndex >= 0) {
          this.appService.manager.splice(this.selectedManagerIndex, 1, postData);
          this.appService.selectedManagerIndex = -1;
          this.selectedManagerIndex = -1;
          this.button.nativeElement.textContent = 'Save';
        } else {
          postData._id = data._id;
          this.appService.manager.push(postData);
        }
        this.managerform.resetForm();
        this.notifyService.success('Info', data.msg);
      } else {
        this.notifyService.error('Info', data.msg);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedManagerIndex = -1;
    this.selectedManagerIndex = -1;
    this.router.navigate(['/manager/manage']);
  }

  onClickDelete(appartementDelete) {
    this.confirmDialog = this.modalService.open(appartementDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  onClickOk() {
    const postData = this.managerInfoForm.value;
    postData.roules = ['manager'];
    this.appService.deleteManager(postData).subscribe((data) => {
      this.appService.manager.splice(this.selectedManagerIndex, 1);
      this.notifyService.success(`Manager ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.managerform.reset();
      this.appService.selectedManagerIndex = -1;
      this.selectedManagerIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }
}
