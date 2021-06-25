import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InLogService {

    // 列表
    public inLog_URL = "/sys/loginLog/list";

    constructor(public HttpClient: HttpClient) { }

    /**
     * 登录日志列表
     * @param json 
     * @returns 
     */
    public getInLogList(json: any | null): Observable<any> {
        json.realName = json.realName.trim();
        return this.HttpClient.post(this.inLog_URL, json);
    }
}
