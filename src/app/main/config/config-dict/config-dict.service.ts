import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ConfigDictService {

    // 根据请求状态不同来区分功能
    public dict_URL = "/dict/";

    constructor(public httpClient: HttpClient) { }
    /**
     * 查询字典列表
     * @param json 参数
     */
    public getDictList(json: any | null): Observable<any> {
        json.name = json.name.trim();
        return this.httpClient.get(this.dict_URL, { params: json });
    }
    /**
     * 新增字典
     * @param json 参数
     */
    public addDict(json: any | null): Observable<any> {
        return this.httpClient.post(this.dict_URL, json);
    }

    /**
     * 删除字典
     * @param json 参数
     */
    public deleteDict(id: any | null): Observable<any> {
        const url = `${this.dict_URL}${id}`;
        return this.httpClient.delete(url);
    }

    /**
     * 更新字典
     * @param json 参数
     */
    public updateDict(id: any, json: any): Observable<any> {
        const url = `${this.dict_URL}${id}`;
        return this.httpClient.put(url, json);
    }



}
