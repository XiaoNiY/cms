import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecycleOrderService {

    /**
     * 订单列表
     */
    public Order_URL = "/recycle/order/";
    /**
     * 用户详情
     */
    public userDetails_URL = "/customer/info/";

    constructor(private httpClient: HttpClient) { }


    /**
     * 用户详情
     */
    public userDetails(userId: any | null): Observable<any> {
        const url = `${this.userDetails_URL}${userId}`;
        return this.httpClient.get(url);
    }
    /**
     * 列表
     */
    public getList(json: any | null): Observable<any> {
        let jsons: any = { ...json };
        jsons.okey = jsons.okey.trim();
        jsons.lnktel = jsons.lnktel.trim();
        jsons.umname = jsons.umname.trim();

        if (jsons.OtimeForm != "") {
            jsons.beginOtime11 = this.shiftBeginDate(jsons.OtimeForm[0]);
            jsons.endOtime11 = this.shiftEndDate(jsons.OtimeForm[1]);
            delete jsons.OtimeForm;
        }

        if (!jsons.userId) {
            delete jsons.userId;
        }
        if (!jsons.okey) {
            delete jsons.okey;
        }
        if (!jsons.lnktel) {
            delete jsons.lnktel;
        }
        if (!jsons.umname) {
            delete jsons.umname;
        }
        if (!jsons.ostat) {
            delete jsons.ostat;
        }
        if (!jsons.orderWay) {
            delete jsons.orderWay;
        }
        if (!jsons.platform) {
            delete jsons.platform;
        }
        if (!jsons.orderUserType) {
            delete jsons.orderUserType;
        }
        if (!jsons.restype) {
            delete jsons.restype;
        }
        if (!jsons.OtimeForm) {
            delete jsons.OtimeForm;
        }
        if (!jsons.beginOtime11) {
            delete jsons.beginOtime11;
        }
        if (!jsons.endOtime11) {
            delete jsons.endOtime11;
        }
        return this.httpClient.get(this.Order_URL, { params: jsons });
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
