import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class appHardcoreAreaService {

  /**
   * 列表
   */
  public GET_URL = "/navigationBar/";
  /**
    * 删除
  */
  public POST_URL = '/navigationBar/'
  /**
   * 文件上传地址
   */
  public FILE_URL = "/common/upload/file";
  // 设置显示和隐藏
  public SET_URL = '/navigationBar/kingKong/setting/'

  constructor(public httpClient: HttpClient) { }

  /**
 * 列表
 * @params json 参数
 */
  public async httpGetNavigationBar(params: any) {
    return await this.httpClient.get(this.GET_URL, { params }).toPromise();
  }

  /**
 * 新增，删除、启用、禁用
 * @params json queryUrl 参数 {id}/{status}
 */
  public async httpPostNavigationBar(queryUrl: any, params: any) {
    return await this.httpClient.post(`${this.POST_URL}${queryUrl}`, params).toPromise();
  }
  /**
 * 编辑 、上移、下移
 * @params json queryUrl 参数 {id}/{status}
 */
  public async httpPutNavigationBar(queryUrl: any, params: any) {
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
  /**
  * 设置 
  * @params json queryUrl 参数 {id}/{status}
  */
  public async httpSetting(queryUrl: any, params: any) {
    return await this.httpClient.put(`${this.SET_URL}${queryUrl}`, params).toPromise();
  }
}



