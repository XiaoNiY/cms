import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class appHomeActivtyService {

  /**
   * 列表
   */
  public GET_URL = "/activity/";
  /**
    * 删除、编辑 、上移、下移、新增
  */
  public POST_URL = '/activity/'
  /**
   * 文件上传地址
   */
  public FILE_URL = "/common/upload/file";


  constructor(public httpClient: HttpClient) { }

  /**
 * 列表
 * @params json 参数
 */
  public async httpGetActivity(params: any) {
    return await this.httpClient.get(this.GET_URL, { params }).toPromise();
  }

  /**
 * 新增，删除、
 * @params json queryUrl 参数 {id}/{status}
 */
  public async httpPostActivity(queryUrl: any, params: any) {
    return await this.httpClient.post(`${this.POST_URL}${queryUrl}`, params).toPromise();
  }
  /**
 * 编辑 、上移、下移
 * @params json queryUrl 参数 {id}/{status}
 */
  public async httpPutActivity(queryUrl: any, params: any) {
    return await this.httpClient.put(`${this.POST_URL}${queryUrl}`, params).toPromise();
  }
  /**
   * 上传文件
   * @param fileToUpload 
   * @returns 
   */
  public async httpPostFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', "ihapp");
    return await this.httpClient.post(this.FILE_URL, formData).toPromise();
  }

}



