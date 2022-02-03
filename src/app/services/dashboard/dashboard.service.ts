import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private static USERS_ENDPOINT: string = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  constructor(private httpClinet: HttpClient) { }

  public getUsers(): Observable<User[]>{
    return this.httpClinet.get<User[]>(DashboardService.USERS_ENDPOINT);
  }
}
