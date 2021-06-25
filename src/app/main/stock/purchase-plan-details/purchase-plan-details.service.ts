import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PurchasePlanDetailsService {

    /**
     * 列表
     */
    public get_URL = "/purchasePlanDetails/list";

    /**
     * 修改采购计划单
     */
    public update_URL = "/procurementPlan/update";

    /**
     * 采购计划详情手动关闭(表格内)
     */
    public closePlan_URL = "/purchasePlanDetails/close";

    constructor(public httpClient: HttpClient) { }

    /**
     * 查询采购计划单详情列表
     */
    public getList(json: any | null): Observable<any> {
        return this.httpClient.post(this.get_URL, json);
    }

    /**
     * 修改采购计划单
     */
    public update(json: any | null): Observable<any> {
        return this.httpClient.post(this.update_URL, json);
    }

    /**
     * 采购计划详情手动关闭(表格内)
     */
    public close(json: any | null): Observable<any> {
        return this.httpClient.post(this.closePlan_URL, json);
    }

}
