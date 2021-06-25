import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class HomeService {
    /**
     * 退出登录
     */
    public URL = "/sys/user/logout";
    /**
     * 菜单列表
     */
    public menuList_URL = "/sys/menu/menuQuery";
    /**
     * 修改密码
     */
    public revisePwd_URL = "/sys/user/revisePwd";
    /**
     * 上传文件
     */
    public FILE_URL = "/common/upload/file";
    /**
     * 员工修改
     */
    public update_URL = "/sys/user/modify";

    /**
   * 员工详情
   */
    public details_URL = "/sys/user/details/";

    constructor(public httpClient: HttpClient) { }
    /**
    * 退出登录
    * @param json 参数
    */
    public exit(): Observable<any> {
        return this.httpClient.post(this.URL, null);
    }
    /**
    * 查询菜单列表
    * @param json 参数
    */
    public menuList(): Observable<any> {
        return this.httpClient.post(this.menuList_URL, null);
    }
    /**
    * 修改密码
    * @param json 参数
    */
    public revisePwd(json: any): Observable<any> {
        let jsons = { ...json };
        delete jsons.affirmPassWord;
        return this.httpClient.post(this.revisePwd_URL, jsons);
    }

    /**
     * 上传文件
     * @param fileToUpload 
     * @returns 
     */
    public postFile(fileToUpload: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('name', "user");
        return this.httpClient.post(this.FILE_URL, formData);
    }

    /**
     * 员工修改
     */
    public update(json: any | null): Observable<any> {
        return this.httpClient.post(this.update_URL, json);
    }

    /**
     * 员工详情
     * @param json 参数
     */
    public details(id: any | null): Observable<any> {
        const url = `${this.details_URL}${id}`;
        return this.httpClient.get(url);
    }
}
