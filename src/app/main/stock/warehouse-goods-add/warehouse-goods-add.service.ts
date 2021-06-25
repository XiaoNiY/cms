import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WarehouseGoodsAddService {

    /**
     * 仓库管理列表
     * */
    public whPutList_URL = "/whPut/list";
    /**
    * 仓库商品新增
    */
    public save_URL = "/whgoods/save";

    /**
     * 仓库商品修改
     */
    public update_URL = "/whgoods/update";

    /**
     * 仓库商品详情
     */
    public details_URL = "/whgoods/get/";

    /**
     * 仓库商品分类下拉
     */
    public type_URL = "/goodstypes/list/";

    /**
     * 仓库商品 品牌下拉
     */
    public brand_URL = "/brand/list";


    /**
     * 文件上传地址
     */
    public FILE_URL = "/common/upload/file";

    constructor(public httpClient: HttpClient) { }

    /**
     * 仓库商品添加
     */
    public save(json: any | null): Observable<any> {
        return this.httpClient.post(this.save_URL, json);
    }

    /**
     * 仓库商品修改
     */
    public update(json: any | null): Observable<any> {
        return this.httpClient.post(this.update_URL, json);
    }

    /**
     * 仓库商品详情
     */
    public details(id: any | null): Observable<any> {
        const url = `${this.details_URL}${id}`;
        return this.httpClient.get(url);
    }

    /**
     * 仓库商品分类下拉
     */
    public getGoodsTypeList(id: any = 1): Observable<any> {
        const url = `${this.type_URL}${id}`
        return this.httpClient.get(url);
    }

    /**
     * 仓库商品 品牌下拉
     */
    public getBrandList(): Observable<any> {
        return this.httpClient.get(this.brand_URL);
    }

    /**
     * 仓库管理列表
     */
    public getWhPutList(): Observable<any> {
        let json = {
            name: '',
            type: '',
            // 多少页，默认1
            page: '1',
            // 每页多少条，默认10
            pageSize: '9999',
        }
        return this.httpClient.post(this.whPutList_URL, json);
    }


    /**
     * 上传文件
     * @param fileToUpload 
     * @returns 
     */
    public postFile(fileToUpload: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('name', "whgoods");
        return this.httpClient.post(this.FILE_URL, formData);
    }
}
