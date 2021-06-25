import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecycleOrderDetailsService {

    /**
     * 订单详情
     */
    public details_URL = "/recycle/order/details/";

    /**
     * 单个质检报告
     */
    public report_URL = "/recycle/order/single/report/";
    /**
     * 单个设备详情
     */
    public deviceDetails_URL = "/recycle/order/single/deviceDetails/";

    /**
     * 查看物理信息
     */
    public logistics_URL = "/recycle/order/logistic/";

    constructor(public httpClient: HttpClient) { }

    /**
     * 详情
     */
    public details(okey: any | null): Observable<any> {
        const url = `${this.details_URL}${okey}`;
        return this.httpClient.get(url, okey);
    }

    /**
     * 单个质检报告
     */
    public report(okey: any, gid: any | null): Observable<any> {
        const url = `${this.report_URL}${okey}/${gid}`;
        return this.httpClient.get(url, okey)
    }
    /**
    * 单个设备详情
    */
    public deviceDetails(okey: any, gid: any | null): Observable<any> {
        const url = `${this.deviceDetails_URL}${okey}/${gid}`;
        return this.httpClient.get(url, okey)
    }

    /**
     * 查看物流信息
     */
    public logistic(okey: any, expno: any | null):Observable<any> {
        const url = `${this.logistics_URL}${okey}/${expno}`;
        return this.httpClient.get(url, okey);
    }
}
