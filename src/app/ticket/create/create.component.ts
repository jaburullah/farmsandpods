import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../../service/app-service.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SessionModel} from '../../model/Session';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, AfterViewInit {

  ticketInfoForm: FormGroup;
  selectedTicketIndex = -1;
  confirmDialog: NgbModalRef;
  errors;
  email;
  appartements;
  managers;
  tenants;
  categories;
  statutes;
  priorities;
  @ViewChild('ticketform') ticketform;
  @ViewChild('actionbutton', {read: ElementRef}) button: ElementRef;
  @ViewChild('ticketdelete', {read: ElementRef}) dialog: ElementRef;
  constructor(private modalService: NgbModal,
              private session: SessionModel,
              private router: Router,
              private appService: AppServiceService,
              private notifyService: NotificationsService,
              private fb: FormBuilder) { }
  ngOnInit() {
    this.errors = {
      name: 'Enter name of Tenant/House Owner',
      address: `Enter Address of Tenant/House Owner`,
      houseNo: `Enter Tenant/House Owner flat no`,
      email: 'Email must be a valid email address (username@domain)',
      mobileNo: 'Mobile Number must be valid (10digits)',
      password: 'Enter login password',
      category: 'Select ticket category',
      priority: 'Select ticket priority',
      status: 'Select ticket status',
      assignee: 'Select ticket assignee',
      appartement: 'Select ticket appartement',
      reporter: 'Select ticket reporter',
      // other
      summary: new FormControl(),
      description: new FormControl()
    };
    this.createTicketForm();
    this.appService.getManager().subscribe((resManagers) => {
      this.managers = resManagers;
      this.appService.getAppartement().subscribe((resAppartements) => {
        this.appService.getTenant().subscribe((resTenant) => {
          this.categories = this.appService.appInfo.category;
          this.statutes = this.appService.appInfo.status;
          this.priorities = this.appService.appInfo.priority;
          this.appartements = resAppartements;
          this.tenants = resTenant;
          this.selectedTicketIndex = this.appService.selectedTicketIndex;
          if (this.selectedTicketIndex >= 0) {
            const selectedTicket = JSON.parse(JSON.stringify(this.appService.ticket[this.selectedTicketIndex]));
            this.ticketInfoForm.setValue(selectedTicket);
          }
        });
      });
    });
  }
  ngAfterViewInit() {
    if (this.selectedTicketIndex >= 0) {
      this.button.nativeElement.textContent = 'Update';
    }
  }
  createTicketForm() {
    this.ticketInfoForm = new FormGroup( {
      _id: new FormControl(),
      createdDate: new FormControl(),
      modifiedDate: new FormControl(),
      no: new FormControl(),
      owner: new FormControl(),
      isManagerAction: new FormControl(),
      isDeleted: new FormControl(),
      // main
      category: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      assignee: new FormControl('', Validators.required),
      appartement: new FormControl('', Validators.required),
      reporter: new FormControl('', Validators.required),
      summary: new FormControl(),
      description: new FormControl(),
    });
  }
  onSubmitTicket() {
    if (!this.ticketInfoForm.valid) {
      this.notifyService.warn(`Error`, 'Enter ticket info');
      return;
    }
    let postData = this.ticketInfoForm.value;
    postData.isDeleted = false;
    // postData.owner = this.session.getUserId();
    this.appService.saveTicket(postData).subscribe((data) => {
      if (data.action) {
        if (this.selectedTicketIndex >= 0) {
          this.appService.ticket.splice(this.selectedTicketIndex, 1, postData);
          this.appService.selectedTicketIndex = -1;
          this.selectedTicketIndex = -1;
          this.button.nativeElement.textContent = 'Save';
        } else {
          postData = data.data;
          this.appService.ticket.push(postData);
        }
        this.ticketform.resetForm();
        this.notifyService.success('Info', data.msg);
      } else {
        this.notifyService.error('Info', data.msg);
      }
    });
  }

  onClickBack() {
    // gg
    this.appService.selectedTicketIndex = -1;
    this.selectedTicketIndex = -1;
    this.router.navigate(['/ticket/manage']);
  }

  onClickDelete(ticketDelete) {
    this.confirmDialog = this.modalService.open(ticketDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  onClickOk() {
    const postData = this.ticketInfoForm.value;
    this.appService.deleteTicket(postData).subscribe((data) => {
      this.appService.ticket.splice(this.selectedTicketIndex, 1);
      this.notifyService.success(`Ticket ${postData.no} deleted successfully`);
      this.confirmDialog.dismiss();
      this.ticketInfoForm.reset();
      this.appService.selectedTicketIndex = -1;
      this.selectedTicketIndex = -1;
      this.button.nativeElement.textContent = 'Save';
    });
  }

}

