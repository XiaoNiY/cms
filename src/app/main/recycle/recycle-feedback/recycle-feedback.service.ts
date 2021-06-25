import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecycleFeedbackService {

    // 意见反馈列表
    public feedback_URL = "/feedback/";

    // 提交处理备注
    public process_URL = "/feedback/processContent/";

    /**
     * 用户详情
     */
    public userDetails_URL = "/customer/info/";

    constructor(private httpClient: HttpClient) { }

    /**
     * 用户详情
     */
    public userDetails(userType: any | null): Observable<any> {
        const url = `${this.userDetails_URL}${userType}`;
        return this.httpClient.get(url);
    }
    // 列表
    public getList(json: any | null): Observable<any> {
        let jsons: any = { ...json };
        jsons.keyword = jsons.keyword.trim();

        if (jsons.createFormat != "") {
            jsons.beginCreateTime = this.shiftCreateDate(jsons.createFormat[0]);
            jsons.endCreateTime = this.shiftEndDate(jsons.createFormat[1]);
            delete jsons.createFormat;
        }
        if (jsons.processFormat != "") {
            jsons.beginProcessTime = this.shiftCreateDate(jsons.processFormat[0]);
            jsons.endProcessTime = this.shiftEndDate(jsons.processFormat[1]);
            delete jsons.processFormat;
        }

        if (!jsons.keyword) {
            delete jsons.keyword;
        }
        if (!jsons.userType) {
            delete jsons.userType;
        }
        if (!jsons.state) {
            delete jsons.state;
        }
        if (!jsons.createFormat) {
            delete jsons.createFormat;
        }
        if (!jsons.beginCreateTime) {
            delete jsons.beginCreateTime;
        }
        if (!jsons.endCreateTime) {
            delete jsons.endCreateTime;
        }
        if (!jsons.processFormat) {
            delete jsons.processFormat;
        }
        if (!jsons.beginProcessTime) {
            delete jsons.beginProcessTime;
        }
        if (!jsons.endProcessTime) {
            delete jsons.endProcessTime;
        }

        return this.httpClient.get(this.feedback_URL, { params: jsons });
    }

    //备注
    public processList(id: any, json: any): Observable<any> {
        const url = `${this.process_URL}${id}?processContent=${json}`;
        return this.httpClient.put(url, json);
    }

    shiftCreateDate(date: any) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + '00:00:00';
        return str;
    }
    shiftEndDate(date: any) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + '23:59:59';
        return str;
    }

    /**
     * 补0
     * @param s 
     */
    p(s: any) {
        return s < 10 ? '0' + s : s
    }
}
