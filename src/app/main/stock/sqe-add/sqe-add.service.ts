import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SqeAddService {

    /**
     * 新增供应商
     */
    public Add_URL = "/supplier/save";

    /**
     * 修改供应商
     */
    public update_URL = "/supplier/update";

    /**
     * 供应商详情
     */
    public details_URL = "/supplier/get/";

    /**
     * 上传文件
     */
    public FILE_URL = "/common/upload/file";

    constructor(public httpClient: HttpClient) { }

    /**
     * 新增供应商列表
     */
    public add(json: any | null): Observable<any> {

        let jsons: any = { ...json };

        if (jsons.createTime != null) {
            let d = new Date(jsons.createTime);
            jsons.createTime = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
        }

        if (jsons.endTime != null) {
            let e = new Date(jsons.endTime);
            jsons.endTime = e.getFullYear() + '-' + this.p((e.getMonth() + 1)) + '-' + this.p(e.getDate());
        }

        return this.httpClient.post(this.Add_URL, jsons);
    }

    /**
     * 修改供应商列表
     */
    public update(json: any | null): Observable<any> {
        let jsons: any = { ...json };
        if (jsons.createTime != null) {
            let d = new Date(jsons.createTime);
            jsons.createTime = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
        }

        if (jsons.endTime != null) {
            let e = new Date(jsons.endTime);
            jsons.endTime = e.getFullYear() + '-' + this.p((e.getMonth() + 1)) + '-' + this.p(e.getDate());
        }
        return this.httpClient.post(this.update_URL, jsons);
    }

    
    /**
     * 供应商详情
     */
    public details(id: any | null): Observable<any> {
        const url = `${this.details_URL}${id}`;
        return this.httpClient.get(url);
    }

    /**
     * 上传文件
     * @param fileToUpload 
     * @returns 
     */
    public postFile(fileToUpload: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('name', "supplier");
        return this.httpClient.post(this.FILE_URL, formData);
    }

    /**
     * 补0
     * @param s 
     */
     p(s: any) {
        return s < 10 ? '0' + s : s
    }
}
