import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private serviceUrl = "http://47.105.179.3:8762";

  /**
   * 登录
   */
  public LOGIN_URL =  this.serviceUrl + "/login/in";


  constructor(public httpClient: HttpClient) { }


  /**
   * 登录
   */
  public login(json: any | null): Observable<any> {
    return this.httpClient.get(this.LOGIN_URL, { params: json });
  }
}
