import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PurchasePlanService {

    /**
     * 采购计划单列表
     */
    public get_URL = "/procurementPlan/list";

    /**
     * 采购计划单删除
     */
    public del_URL = "/procurementPlan/delete";

    constructor(public httpClient: HttpClient) { }

    /**
     * 采购计划列表
     */
    public getPurchaseList(json: any | null): Observable<any> {
        let jsons: any = { ...json };

        if (jsons.dateFormat.length != 0) {
            jsons.beginTime = this.shiftBeginDate(jsons.dateFormat[0]);
            jsons.endTime = this.shiftEndDate(jsons.dateFormat[1]);
            delete jsons.dateFormat
        }

        return this.httpClient.post(this.get_URL, jsons);
    }

    /**
     * 采购计划单删除
     */
    public del(json: any | null): Observable<any> {
        return this.httpClient.post(this.del_URL, json);
    }

    /**
     * 时间格式转换 年月日
     * @param date 
     * @returns 
     */
    shiftBeginDate(date: any) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + '00:00:00';
        return str;
    }
    /**
     * 时间格式转换 年月日
     * @param date 
     * @returns 
     */
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
