import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PurchasePlanApplyService {
    /**
     * 新增采购计划单
     */
    public add_URL = "/procurementPlan/save";

    /**
     * 修改采购计划单
     */
    public update_URL = "/procurementPlan/update";

    /**
     * 上传文件
     */
    public FILE_URL = "/common/upload/file";

    /**
     * 采购计划单查询商品
     */
    public whGet_URL = "/whgoods/conditionQuery";

    /**
     * 查询采购计划单详情列表
     */
    public details_URL = "/purchasePlanDetails/list";

    /**
     * 查询仓库列表
     */
    public wh_URL = "/whPut/list";

    constructor(private httpClient: HttpClient) { }

    /**
     * 添加采购计划单
     */
    public add(json: any | null): Observable<any> {
        let jsons: any = { ...json };

        for (let i = 0; i < jsons.list.length; i++) {
            if (jsons.list[i].deliveryTime != undefined || jsons.list[i].deliveryTime != null) {
                let d = new Date(jsons.list[i].deliveryTime);
                jsons.list[i].deliveryTime = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()) + ':' + this.p(d.getMinutes() + ':' + this.p(d.getSeconds()));// 时间转换的方式
            }
            if (jsons.list[i].endDeliveryTime != undefined || jsons.list[i].endDeliveryTime != null) {
                let e = new Date(jsons.list[i].endDeliveryTime);
                jsons.list[i].endDeliveryTime = e.getFullYear() + '-' + this.p((e.getMonth() + 1)) + '-' + this.p(e.getDate()) + ' ' + this.p(e.getHours()) + ':' + this.p(e.getMinutes() + ':' + this.p(e.getSeconds()));// 时间转换的方式
            }
        }

        return this.httpClient.post(this.add_URL, jsons);
    }

    /**
     * 修改采购计划单
     */
    public update(json: any | null): Observable<any> {
        let jsons: any = { ...json };

        for (let i = 0; i < jsons.list.length; i++) {
            if (jsons.list[i].deliveryTime != undefined || jsons.list[i].deliveryTime != null) {
                let d = new Date(jsons.list[i].deliveryTime);
                jsons.list[i].deliveryTime = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()) + ':' + this.p(d.getMinutes() + ':' + this.p(d.getSeconds()));// 时间转换的方式
            }
            if (jsons.list[i].endDeliveryTime != undefined || jsons.list[i].endDeliveryTime != null) {
                let e = new Date(jsons.list[i].endDeliveryTime);
                jsons.list[i].endDeliveryTime = e.getFullYear() + '-' + this.p((e.getMonth() + 1)) + '-' + this.p(e.getDate()) + ' ' + this.p(e.getHours()) + ':' + this.p(e.getMinutes() + ':' + this.p(e.getSeconds()));// 时间转换的方式
            }
        }

        return this.httpClient.post(this.update_URL, jsons);
    }

    /**
     * 上传文件
     * @param fileToUpload 
     * @returns 
     */
    public postFile(fileToUpload: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('name', "purchase");
        return this.httpClient.post(this.FILE_URL, formData);
    }

    /**
     * 采购计划单查询商品
     */
    public whGetList(json: any | null): Observable<any> {
        return this.httpClient.post(this.whGet_URL, json);
    }

    /**
     * 查询采购计划单详情列表
     */
    public details(json: any | null): Observable<any> {
        return this.httpClient.post(this.details_URL, json);
    }
    
    /**
     * 查询仓库列表
     */
     public wh(): Observable<any> {
         let json = {
             name: '',
             type: '',
             page: '1',
             pageSize: '9000'
         }
        return this.httpClient.post(this.wh_URL,json);
    }

    /**
     * 补0
     * @param s 
     */
    p(s: any) {
        return s < 10 ? '0' + s : s
    }
}
