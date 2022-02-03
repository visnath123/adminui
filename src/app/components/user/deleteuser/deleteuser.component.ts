import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-deleteuser',
  templateUrl: './deleteuser.component.html',
  styleUrls: ['./deleteuser.component.scss']
})
export class DeleteUserComponent {

  public message: String;

  constructor(public activeModal: NgbActiveModal) { }

  public delete(){
    this.activeModal.close(true);
  }

  public close(){
    this.activeModal.close(false);
  }

}
