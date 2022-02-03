import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DeleteUserComponent } from '../deleteuser/deleteuser.component';
import { EditUserComponent } from '../edituser/edituser.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public usersDataSource: User[] = [];

  public displayedColumns: string[] = [
    "selection",
    "name",
    "email",
    "role",
    "action"
  ]

  public pageSize:number = 10;
  public page:number = 1;
  public pagesWithAllSelectedUsers: Set<number> = new Set<number>();
  public searchUsersForm: FormGroup = new FormGroup({});
  
  @ViewChild("selectUnselectAllUsersCheckbox") public selectUnselectAllUsersCheckbox: ElementRef;
  @ViewChildren("selectUnselectUserCheckbox") public selectUnselectUserCheckbox: QueryList<ElementRef>;
  @ViewChild("paginator") public paginator: NgbPagination;

  public selectedUsers: Map<number, User[]>  = new Map<number, User[]>();

  constructor(private dashboardService: DashboardService, private formBuilder: FormBuilder, 
    private modalService: NgbModal) {
    this.searchUsersForm = this.formBuilder.group({
      filter : ['', []]
    });
  }
 
  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers(){
    this.dashboardService.getUsers().subscribe(users => {
      if(users.length == 0){
        return;
      }
      this.users.next(users);
      this.usersDataSource = users;
    });
  }

  private userMatcher = (user: User, searchInput: string) => {
      return user.name.toLowerCase().includes(searchInput.trim())
          || user.email.includes(searchInput.trim())
          || user.role.includes(searchInput.trim())
  };

  public search() {
    let searchInput: string = this.searchUsersForm.get('filter').value;
    let filteredUsers = this.usersDataSource.filter(user => this.userMatcher(user, searchInput.toLowerCase().trim()))
    this.users.next(filteredUsers);
  }

  public isUserSelected(selectedUser: User): boolean {
    if(!this.selectedUsers.has(this.page)){
      return false;
    }
    return this.selectedUsers.get(this.page).some(user => user.id == selectedUser.id);
  }

  public selectUser(user: User, index: number) {
    let isChecked: boolean =  this.selectUnselectUserCheckbox.get(index).nativeElement.checked;
    if(!this.selectedUsers.has(this.page)){
      this.selectedUsers.set(this.page, []);
    }
    // toogle
    if(isChecked){
      this.selectedUsers.get(this.page).push(user);
      return;
    }
    let selectedUsers = this.selectedUsers.get(this.page).filter(selectedUser => selectedUser.id != user.id);
    this.selectedUsers.set(this.page, selectedUsers);
  }

  public selectDeselectAllUsers() {
    let isChecked: boolean = this.selectUnselectAllUsersCheckbox.nativeElement.checked;
    
    if(!this.selectedUsers.has(this.page)){
      this.selectedUsers.set(this.page, []);
    }
    
    // toogle
    if(isChecked){
      let startIndex = this.page;
      let endIndex = this.page * this.pageSize;
      let users =  JSON.parse(JSON.stringify(this.users.value));
      this.selectedUsers.set(this.page, users.splice(startIndex-1, endIndex));
      this.pagesWithAllSelectedUsers.add(this.page);
      return;
    }
    this.pagesWithAllSelectedUsers.delete(this.page);
    
  }

  public editUser(selectedUser: User){
    let modelReference:NgbModalRef = this.modalService.open(EditUserComponent);
    modelReference.componentInstance.user = selectedUser;
    modelReference.result.then((updatedUser: User) => {
      if(updatedUser == null){
          return;
      }
      // remove the selectedUser from list
      let users = this.usersDataSource.filter(user => user.id != selectedUser.id);  
      // add the updatedUser
      users.unshift(updatedUser);
      this.users.next(users);
      this.usersDataSource = users;
    });
  }

  public deleteUser(userToDelete: User){
    let modelReference:NgbModalRef = this.modalService.open(DeleteUserComponent);
    modelReference.componentInstance.message = "Are you sure to delete User: "+userToDelete.name+" ?";
    modelReference.result.then((confirmDelete: boolean) => {
      if(!confirmDelete){
          return;
      }
      // remove the selectedUser from list
      let users = this.usersDataSource.filter(user => user.id != userToDelete.id);  
      this.users.next(users);
      this.usersDataSource = users;
    });
  }

  public deleteSelectedUsers(){
    let modelReference:NgbModalRef = this.modalService.open(DeleteUserComponent);
    modelReference.componentInstance.message = "Are you sure to delete selected Users ?";
    modelReference.result.then((confirmDelete: boolean) => {
      if(!confirmDelete){
          return;
      }
      // remove the selectedUsers from list
      let selectedUserIds = this.selectedUsers.get(this.page).map(user => user.id);
      this.usersDataSource = this.usersDataSource.filter(user => !selectedUserIds.includes(user.id));
      this.users.next(this.usersDataSource);
      this.selectedUsers.set(this.page, []);
    });
  }

  public changePage(currentPage: number){
    this.page = currentPage;
  }

}
