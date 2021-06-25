import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClientTypeManagementService {

    /**
     * 上传文件
     */
    public FILE_URL = "/common/upload/file";

    constructor(public httpClient: HttpClient) { }

    /**
     * 上传文件
     * @param fileToUpload 
     * @returns 
     */
    public postFile(fileToUpload: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('name', "supplier");
        return this.httpClient.post(this.FILE_URL, formData);
    }
}
