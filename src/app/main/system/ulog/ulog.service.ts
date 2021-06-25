import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class UlogService {

    /**
     * 员工列表
     */
    public GET_URL = "/backstageLog/list";
    constructor(public httpClient: HttpClient) { }
    /**
    * 查询员工列表
    * @param json 参数
    */
    public list(json: any | null): Observable<any> {
        json.realName = json.realName.trim();
        return this.httpClient.post(this.GET_URL, json);
    }
}
