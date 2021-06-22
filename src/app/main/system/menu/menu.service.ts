import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private serviceUrl = "http://47.105.179.3:8080";

  public menu_list_RUL = this.serviceUrl + "/menu/list";


  constructor(public httpClient: HttpClient) { }

  public menuList(json: any | null): Observable<any> {
    return this.httpClient.post(this.menu_list_RUL, json);
  }

}
