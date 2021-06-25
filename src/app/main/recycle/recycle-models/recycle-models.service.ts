import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecycleModelsService {

    // 列表
    public models_URL = "/recycle/model/";
    constructor(private httpClient: HttpClient) { }

    // 机型列表
    public getList(json: any | null): Observable<any> {
        json.name = json.name.trim();
        json.brandName = json.brandName.trim();
 
        return this.httpClient.get(this.models_URL, { params: json });
    }
}
