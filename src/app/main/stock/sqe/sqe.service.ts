import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SqeService {

    /**
     *供应商详情 公共数据
     */
    public detailsData: any = null;
    /**
     * 供应商列表
     */
    public get_URL = "/supplier/list";

    constructor(public httpClient: HttpClient) { }

    /**
     * 查询供应商列表
     */
    public getList(json: any | null): Observable<any> {
        json.name = json.name.trim();
        return this.httpClient.post(this.get_URL, json);
    }
}
