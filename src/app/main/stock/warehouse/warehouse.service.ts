import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WarehouseService {
    /**
     * 仓库列表
     * */
    public getList_URL = "/whPut/list";

    /**
     * 添加仓库
     */
    public add_URL = "/whPut/save";
    /**
     * 编辑仓库
     */
    public update_URL = "/whPut/update";
    /**
     * 删除仓库
     */
    public del_URL = "/whPut/delete";
    /**
     * 仓库详情
     */
    public get_Item_URL = "/whPut/get/";

    constructor(public httpClient: HttpClient) { }

    /**
     * 查询仓库列表
     */
    public getList(json: any | null): Observable<any> {
        json.name = json.name.trim();
        return this.httpClient.post(this.getList_URL, json);
    }

    /**
     * 添加仓库
     */
    public add(json: any | null): Observable<any> {
        return this.httpClient.post(this.add_URL, json);
    }
    /**
     * 编辑仓库
     */
    public update(json: any | null): Observable<any> {
        return this.httpClient.post(this.update_URL, json);
    }
    /**
     * 删除仓库
     */
    public del(json: any | null): Observable<any> {
        return this.httpClient.post(this.del_URL, json);
    }
    /**
     * 仓库详情
     */
    public getItem(id: any | null): Observable<any> {
        const url = `${this.get_Item_URL}${id}`;
        return this.httpClient.get(url);
    }
}
