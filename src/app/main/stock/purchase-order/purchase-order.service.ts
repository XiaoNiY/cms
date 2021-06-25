import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PurchaseOrderService {

    /**
     * 采购单查询
     */
    public get_URL = "/purchase/list";
    /**
     * 采购单删除
     */
    public delete_URL = "/purchase/delete";
    /**
     * 采购单导出
     */
    public export_URL = "/purchase/export";

    constructor(public httpClient: HttpClient) { }

    /**
     * 采购单查询
     */
    public getList(json: any | null): Observable<any> {
        let jsons = { ...json };
        if (jsons.dateFormat.length != 0) {
            jsons.beginTime = this.shiftDate(jsons.dateFormat[0]);
            jsons.endTime = this.shiftDate(jsons.dateFormat[1]);
            delete jsons.dateFormat;
        }
        return this.httpClient.post(this.get_URL, jsons);
    }
    /**
     * 采购单删除
     */
    public delete(id: any | null): Observable<any> {
        return this.httpClient.post(this.delete_URL, { id: id });
    }
    /**
     * 时间格式转换 年月日
     * @param date 
     * @returns 
     */
    shiftDate(date: any) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
        return str;
    }
    /**
     * 补0
     * @param s 
     */
    p(s: any) {
        return s < 10 ? '0' + s : s
    }
    public async httpExportOrder(parmas: any) {
        return this.httpClient.get(this.export_URL, parmas).toPromise()
    }
}
