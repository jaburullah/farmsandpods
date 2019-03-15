import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../../service/app-service.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, AfterViewInit {

  tenantInfoForm: FormGroup;
  selectedTenantIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  email;
  appartements;
  @ViewChild('tenantform') tenantform;
  @ViewChild('actionbutton', {read: ElementRef}) button: ElementRef;
  @ViewChild('managerdelete', {read: ElementRef}) dialog: ElementRef;
  constructor(private modalService: NgbModal,
              private router: Router, private appService: AppServiceService,
              private notifyService: NotificationsService,
              private fb: FormBuilder) { }
  ngOnInit() {
    this.errors = {
      name: 'Enter name of Tenant/House Owner',
      address: `Enter Address of Tenant/House Owner`,
      houseNo: `Enter Tenant/House Owner flat no`,
      email: 'Email must be a valid email address (username@domain)',
      mobileNo: 'Mobile Number must be valid (10digits)',
      password: 'Enter login password'
    };
    this.createBasicInfoForm();
    this.appService.getAppartement().subscribe((data) => {
      this.appartements = data;
      this.selectedTenantIndex = this.appService.selectedTenantIndex;
      if (this.selectedTenantIndex >= 0) {
        const selectedTenant = JSON.parse(JSON.stringify(this.appService.tenant[this.selectedTenantIndex]));
        this.email = selectedTenant.email;
        this.tenantInfoForm.setValue(selectedTenant);
      }
    });
  }
  ngAfterViewInit() {
    if (this.selectedTenantIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }
  createBasicInfoForm() {
    this.tenantInfoForm = new FormGroup( {
      _id: new FormControl(),
      name: new FormControl('', Validators.required),
      houseNo: new FormControl('', Validators.required),
      address: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      appartement: new FormControl(),
      // other
      addressProof: new FormControl(),
      panCard: new FormControl(),
      voterId: new FormControl(),
      roles: new FormControl(),
      isDeleted: new FormControl()
    });
  }
  onSubmitBasicInfo() {
    if (!this.tenantInfoForm.valid) {
      this.notifyService.warn(`Error`, 'Enter Customer info');
      return;
    }
    const postData = this.tenantInfoForm.value;
    postData.roles = ['tenant'];
    postData.isDeleted = false;
    this.appService.saveTenant(postData).subscribe((data) => {
      if (data.action) {
        if (this.selectedTenantIndex >= 0) {
          this.appService.tenant.splice(this.selectedTenantIndex, 1, postData);
          this.appService.selectedTenantIndex = -1;
          this.selectedTenantIndex = -1;
          this.button.nativeElement.textContent = 'Save';
        } else {
          postData._id = data._id;
          this.appService.tenant.push(postData);
        }
        this.tenantform.resetForm();
        this.notifyService.success('Info', data.msg);
      } else {
        this.notifyService.error('Info', data.msg);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedTenantIndex = -1;
    this.selectedTenantIndex = -1;
    this.router.navigate(['/tenant/manage']);
  }

  onClickDelete(appartementDelete) {
    this.confirmDialog = this.modalService.open(appartementDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  onClickOk() {
    const postData = this.tenantInfoForm.value;
    postData.roules = ['manager'];
    this.appService.deleteTenant(postData).subscribe((data) => {
      this.appService.tenant.splice(this.selectedTenantIndex, 1);
      this.notifyService.success(`Customer ${postData.name} deleted successfully`);
      this.confirmDialog.dismiss();
      this.tenantform.reset();
      this.appService.selectedTenantIndex = -1;
      this.selectedTenantIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }

}
