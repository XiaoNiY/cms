import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataConfigService {

    /**
     * 配置列表
     */
    public config_URL = "/recycle/config/";

    /**
     * 更换提交方式
     */
    public save_URL = "/recycle/config/pcI4Window";
    constructor(public httpClient: HttpClient) { }

    /**
     * 列表
     * @returns 
     */
    public getList(): Observable<any> {
        return this.httpClient.get(this.config_URL);
    }

    /**
     * 提交
     * @returns 
     */
    public save(json: any | null): Observable<any> {
        // const url = `${this.save_URL}?popupWay=${json}`;
        return this.httpClient.put(this.save_URL, new HttpParams({ fromObject: json }))
    }
}
