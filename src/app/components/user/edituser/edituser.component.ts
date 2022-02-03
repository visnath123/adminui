import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EditUserComponent implements OnInit {

  public editUserForm: FormGroup;
  public user: User;
  
  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.editUserForm = this.formBuilder.group({
      userName : [this.user.name, [Validators.required]],
      userEmail : [this.user.email, [Validators.required, Validators.email]],
      userRole: [this.user.role, [Validators.required]]
    });
  }

  public updateUser(){
    if(this.editUserForm.invalid){
      return;
    }

    let updatedUser: User = {
      id: this.user.id,
      name: this.editUserForm.get('userName').value,
      email: this.editUserForm.get('userEmail').value,
      role: this.editUserForm.get('userRole').value
    };

    this.activeModal.close(updatedUser);
  }

  public close(){
    this.activeModal.close(null);
  }

}
