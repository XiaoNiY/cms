import { Injectable } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class RoutingCache implements RouteReuseStrategy {
    constructor() { }

    public static handlers: { [key: string]: DetachedRouteHandle } = {};
    
    public static deleteRouteSnapshot(path: string): void {
        const name = path.replace(/\//g, '_');
        if (RoutingCache.handlers[name]) {
            delete RoutingCache.handlers[name];
        }
    }
    // 表示对路由允许复用
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // 默认对所有路由复用 可通过给路由配置项增加data: { keep: true }来进行选择性使用，代码如下
        if (!route.data.keep) {
            return false;
        }
        return true;
    }
    // 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        RoutingCache.handlers[this.getRouteUrl(route)] = handle;
    }
    // 若path在缓存中有的都认为允许还原路由
    public shouldAttach(route: any): boolean {
        // 路由恢复 通知组件调用更新方法
        route.routeConfig.component.updateCache && route.routeConfig.component.updateCache();
        return !!route.routeConfig && !!RoutingCache.handlers[this.getRouteUrl(route)];
    }
    // 从缓存中获取快照，若无则返回null
    public retrieve(route: any): any {
        if (!route.routeConfig) {
            return null;
        }
        return RoutingCache.handlers[this.getRouteUrl(route)];
    }
    // 进入路由触发，判断是否同一路由
    public shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        return future.routeConfig == current.routeConfig &&
            JSON.stringify(future.params) == JSON.stringify(current.params);
    }
    private getRouteUrl(route: any) {
        return route['_routerState'].url.replace(/\//g, '_')
            + '_' + (route.routeConfig.loadChildren || route.routeConfig.component.toString().split('(')[0].split(' ')[1]);
    }


}