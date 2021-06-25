import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SellUserCouponService {

    /**
     * 用户优惠劵列表
     */
    public _URL = "/couponUserRecord/";

    /**
     * 批量停止优惠劵（用户）
     */
    public stop_URL = "/couponUserRecord/list";
    constructor(public httpClient: HttpClient) { }

    /**
     * 列表
     */
    public getList(json: any | null): Observable<any> {
        let jsons = { ...json }
        jsons.userInfo = jsons.userInfo.trim();
        jsons.couponNo = jsons.couponNo.trim();

        if (jsons.getTimeForm != "") {
            jsons.getBeginTime = this.shiftBeginDate(jsons.getTimeForm[0]);
            jsons.getEndTime = this.shiftEndDate(jsons.getTimeForm[1]);
            delete jsons.getTimeForm;
        }

        if (!jsons.userInfo) {
            delete jsons.userInfo;
        }
        if (!jsons.status) {
            delete jsons.status;
        }
        if (!jsons.type) {
            delete jsons.type;
        }
        if (!jsons.couponNo) {
            delete jsons.couponNo;
        }
        if (!jsons.getTimeForm) {
            delete jsons.getTimeForm;
        }
        if (!jsons.getBeginTime) {
            delete jsons.getBeginTime;
        }
        if (!jsons.getEndTime) {
            delete jsons.getEndTime;
        }

        return this.httpClient.get(this._URL, { params: jsons });
    }

    /**
     * 停止
     */
    public stopCoupon(json: any | null): Observable<any> {
        return this.httpClient.put(this.stop_URL, json)
    }

    shiftBeginDate(date: any) {
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
