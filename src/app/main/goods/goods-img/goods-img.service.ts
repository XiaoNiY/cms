import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GoodsImgService {
  /**
   * 更新
   */
  public UPDATE_URL = "/goods/update";
  /**
   * 文件上传地址
   */
  public FILE_URL = "/common/upload/file";

  constructor(public httpClient: HttpClient) { }
  /**
  * 更新
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.post(this.UPDATE_URL, json);
  }
  /**
   * 上传文件
   * @param fileToUpload 
   * @returns 
   */
  public postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', "goods");
    return this.httpClient.post(this.FILE_URL, formData);
  }
}
