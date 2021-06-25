import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsPublicnoteService {
  public GET_URL = "/goodspublicnote/list/page";
  public DELETE_URL = "/goodspublicnote/remove/";
  public ADD_URL = "/goodspublicnote/add";
  public UPDATE_URL = "/goodspublicnote/update";
  public GETITEM_URL = "/goodspublicnote/get/";

  /**
   * 文件上传地址
   */
   public FILE_URL = "/common/upload/file";
  constructor(public httpClient: HttpClient) { }

  /**
  * 列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    return this.httpClient.get(this.GET_URL, { params: json });
  }
  /**
  * 删除
  * @param json 参数
  */
  public delete(id: any | null): Observable<any> {
    const url = `${this.DELETE_URL}${id}`;
    return this.httpClient.get(url);
  }

  /**
  * 添加
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    delete json.id;
    return this.httpClient.post(this.ADD_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 更新
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_URL, { params: json });
  }
  /**
  * 根据ID获取详情
  * @param json 参数
  */
  public getItem(id: any | null): Observable<any> {
    const url = `${this.GETITEM_URL}${id}`;
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
    formData.append('name', "goods");
    return this.httpClient.post(this.FILE_URL, formData);
  }

}
