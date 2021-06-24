import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
/**
 * 拦截器，拦截所有http请求
 */

@Injectable()
export class WholeInterceptor implements HttpInterceptor {
    // 调试模式
    public deBug: boolean = true;

    public HOST = "";
    constructor(
        private router: Router,
        private message: NzMessageService,
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        if (this.deBug) {
            // 本地代理 · 测试环境
            // this.HOST = "/test";
            // 本地代理 · 本地环境
            this.HOST = "/loca";
            // 本地代理 · 生成环境
            // this.HOST = "/i5";
        }
        let url = req.url;

        // 判断是否加载本地json
        if(url.indexOf(".json") != -1){
            this.HOST = "";
        }

        url = this.HOST + url;

        req = req.clone({
            url
        });
        return next.handle(req).pipe(
            tap((event: any) => {
                // 请求成功
                if (event.status == 200) {
                    // 业务处理：一些通用操作 
                    switch (event.body.code) {
                        case -1: // 未登录状态码
                            this.createMessage("error", "登录超时");
                            this.router.navigate(['login']);
                            break;
                    }
                }
            },
                error => {
                }
            ),
            // 都会调用
            finalize(() => {

            })
        );
    }

    /**
     * 全局展示操作反馈信息
     * @param type 其他提示类型 success:成功 error:失败 warning:警告
     */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}