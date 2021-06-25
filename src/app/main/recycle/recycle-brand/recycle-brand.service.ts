import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecycleBrandService {

    // 列表
    public brand_URL = "/recycle/brand/";

    constructor(private httpClient: HttpClient) { }

    //品牌列表
    public getList(json: any | null): Observable<any> {
        let jsons: any = { ...json }
        jsons.name = jsons.name.trim();
        
        if (!jsons.name) {
            delete jsons.name;
        }

        if (!jsons.type) {
            delete jsons.type;
        }
        return this.httpClient.get(this.brand_URL, { params: jsons });
    }
}
