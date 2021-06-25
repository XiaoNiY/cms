import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GoodsSpecarrService {

    /**
     * 商品规格组列表
     */
    public GET_URL = "/skugroup/list/page";
    /**
     * 删除商品规格组
     */
    public DELETE_URL = "/skugroup/remove/";



    constructor(public httpClient: HttpClient) { }
    /**
    * 商品规格组列表
    * @param json 参数
    */
    public list(json: any | null): Observable<any> {
        json.name = json.name.trim();
        return this.httpClient.post(this.GET_URL, new HttpParams({ fromObject: json }));
    }
    /**
    * 删除类型
    * @param json 参数
    */
    public delete(id: any | null): Observable<any> {
        const url = `${this.DELETE_URL}${id}`;
        return this.httpClient.get(url);
    }

}
