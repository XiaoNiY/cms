import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, PRIMARY_OUTLET, NavigationEnd } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from '../../app.service';
import { Global } from '../../shared/global';
import { RoutingCache } from '../../RoutesCache';

import { HomeService } from './home.service';
import { forkJoin } from 'rxjs';


import { ConfigDictService } from '../../main/config/config-dict/config-dict.service';

import "rxjs/add/operator/filter";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    CacheLoadingOne = false;
    text = "配件商城"
    passwordModal: any = false;
    accountModal: any = false;
    /**
     * 头像
     */
    fileVal = "";
    /**
     * 主窗体
     */
    @ViewChild('mainScroll')
    mainScroll!: ElementRef;

    /**
     * 修改密码接口参数
     */
    entityParam: any = {
        //   账号
        accountNumber: null,
        // 旧密码
        oldPwd: null,
        // 新密码
        passWord: null,
        // 确认新密码
        affirmPassWord: null,
    }

    /**
     * 账号信息
     */
    accountParam: any = {
        id: null,
        // 用户名
        userName: null,
        // 姓名
        realName: null,
        // 联系方式
        phoneNumber: null,
        // 昵称
        name: null,
        // 头像
        img: null,
        // 状态 0表示可用 1表示不可用
        state: '0',
        // 备注
        remarks: null,
        isFirst: null,
        // 排序
        sort: null,
        // 角色id
        roleId:null,
    }

    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 当前路由
     */
    activeRoutin: any = null;
    /**
     * 面包屑路由字典
     */
    routingArr = [
        {
            breadcrumb: "商品列表",
            path: "goods/goodsAll",
            children: [
                {
                    breadcrumb: "商品详情",
                    path: "goods/goodsTabs",
                }
            ]
        },
        {
            breadcrumb: "商品规格组",
            path: "goods/goodsSpenarr",
            children: [
                {
                    breadcrumb: "商品规格组编辑",
                    path: "goods/goodsSpenarrSave",
                }
            ]
        },
        {
            breadcrumb: "商品属性",
            path: "goods/goodsAttr",
            children: [
                {
                    breadcrumb: "商品属性详情",
                    path: "goods/goodsList",
                }
            ]
        },
        {
            breadcrumb: "推荐商品配置",
            path: "goods/goodsRecommendConfig",
            children: []
        },
        {
            breadcrumb: "用户端分类管理",
            path: "goods/clientTypeManagement",
            children: []
        },
        {
            breadcrumb: "配件订单",
            path: "order/orderAcc",
            children: [
                {
                    breadcrumb: "配件订单详情",
                    path: "order/accDetails",
                }
            ]
        },
        {
            breadcrumb: "优惠券",
            path: "sell/coupon",
            children: [
                {
                    breadcrumb: "优惠券信息",
                    path: "sell/save",
                },
                {
                    breadcrumb: "优惠券详情",
                    path: "sell/detail",
                }
            ]
        },
        {
            breadcrumb: "优惠券",
            path: "sell/userCoupon",
            children: []
        },
        {
            breadcrumb: "邀请有礼",
            path: "sell/invite",
            children: [
                {
                    breadcrumb: "邀请有礼活动配置",
                    path: "sell/inviteSave",
                }
            ]
        },
        {
            breadcrumb: "供应商管理",
            path: "stock/sqe",
            children: [
                {
                    breadcrumb: "供应商信息",
                    path: "stock/sqeAdd",
                }
            ]
        },
        {
            breadcrumb: "仓库管理",
            path: "stock/warehouseWm",
            children: []
        },
        {
            breadcrumb: "仓库商品",
            path: "stock/warehouseGoods",
            children: [
                {
                    breadcrumb: "仓库商品信息",
                    path: "stock/warehouseGoodsAdd",
                }
            ]
        },
        {
            breadcrumb: "采购计划",
            path: "stock/purchasePlan",
            children: [
                {
                    breadcrumb: "新建采购计划单",
                    path: "stock/purchasePlanApply",
                },

                {
                    breadcrumb: "采购计划单详情",
                    path: "stock/purchasePlanDetails",
                }
            ]
        },
        {
            breadcrumb: "采购单",
            path: "stock/purchaseOrder",
            children: [
                {
                    breadcrumb: "申请采购单",
                    path: "stock/purchaseOrderAdd",
                },
                {
                    breadcrumb: "采购单详情",
                    path: "stock/purchaseOrderDetails",
                }
            ]
        },
        {
            breadcrumb: "入库单",
            path: "stock/put",
            children: [
                {
                    breadcrumb: "申请入库单",
                    path: "stock/putSave",
                },
                {
                    breadcrumb: "入库单详情",
                    path: "stock/putDetails",
                }
            ]
        },
        {
            breadcrumb: "出库单",
            path: "stock/out",
            children: [
                {
                    breadcrumb: "申请出库单",
                    path: "stock/outSave",
                },
                {
                    breadcrumb: "出库单详情",
                    path: "stock/outDetails",
                }
            ]
        },
        {
            breadcrumb: "字典管理",
            path: "config/configDict",
            children: [
                {
                    breadcrumb: "字典明细",
                    path: "config/DictList",
                }
            ]
        },
        {
            breadcrumb: "品牌管理",
            path: "config/ConfigBrand",
            children: []
        },
        {
            breadcrumb: "地址管理",
            path: "config/configAddress",
            children: []
        },
        {
            breadcrumb: "商品分类配置",
            path: "goods/goodsClassify",
            children: []
        },
        {
            breadcrumb: "商品通用说明",
            path: "goods/goodsPublicnote",
            children: []
        },
        {
            breadcrumb: "菜单管理",
            path: "system/menu",
            children: []
        },
        {
            breadcrumb: "角色管理",
            path: "system/role",
            children: []
        },
        {
            breadcrumb: "员工管理",
            path: "system/staff",
            children: []
        },
        {
            breadcrumb: "操作日志",
            path: "system/ulog",
            children: []
        },
        {
            breadcrumb: "登陆日志",
            path: "system/inLog",
            children: []
        },
        {
            breadcrumb: "客户管理",
            path: "customer/merchant",
            children: [
                {
                    breadcrumb: "客户信息",
                    path: "customer/tabs",
                }
            ]
        },
        {
            breadcrumb: "门店资料管理",
            path: "customer/store",
            children: []
        },
        {
            breadcrumb: "回收订单",
            path: "recycle/recOrder",
            children: [
                {
                    breadcrumb: "回收订单详情",
                    path: "recycle/orderDetails"
                }
            ]
        },
        {
            breadcrumb: "品牌管理",
            path: "recycle/brand",
            children: []
        },
        {
            breadcrumb: "机型管理",
            path: "recycle/models",
            children: []
        },
        {
            breadcrumb: "数据配置",
            path: "recycle/dataConfig",
            children: []
        },
        {
            breadcrumb: "意见反馈",
            path: "recycle/feedback",
            children: []
        },
        {
            breadcrumb: "售后单管理",
            path: "service/sale",
            children: [
                {
                    breadcrumb: "售后单管理详情",
                    path: "service/saleDetails"
                }]
        },
        {
            breadcrumb: "新建调节单",
            path: "service/newAdjustOrder",
            children: []
        },
        {
            breadcrumb: "金刚区",
            path: "ihapp/appHardcoreArea",
            children: []
        },
        {
            breadcrumb: "首页活动",
            path: "ihapp/appHomeActivity",
            children: []
        },
        {
            breadcrumb: "热门搜索",
            path: "ihapp/appHotSearch",
            children: []
        },
        {
            breadcrumb: "分类管理",
            path: "ihapp/appManagement",
            children: []
        },
    ]
    navData: any = [];
    userInfo: any = null;
    breadcrumbs: any = {};
    /**
     * 菜单数据源
     */
    menuData?: any = null;
    /**
     * 菜单收缩
     */
    isCollapsed = false;
    fallback =
        'data:image/png;base64,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';

    constructor(
        private ConfigDictService: ConfigDictService,
        private router: Router,
        private AppService: AppService,
        private message: NzMessageService,
        public activatedRoute: ActivatedRoute,
        private HomeService: HomeService
    ) {
        this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            // this.breadcrumbs = [];
            //set breadcrumbs

            let root: ActivatedRoute = this.activatedRoute.root;
            this.getBreadcrumbs(root);
            for (let index = 0; index < this.routingArr.length; index++) {
                const element = this.routingArr[index];
                let obj: any = {};

                if (element.path.indexOf(this.activeRoutin) != -1) {
                    obj.breadcrumb = element.breadcrumb;
                    obj.path = element.path;
                    this.breadcrumbs = obj;
                    break;
                }
                for (let index = 0; index < element.children.length; index++) {
                    const c = element.children[index];
                    if (c.path.indexOf(this.activeRoutin) != -1) {

                        obj.path = element.path;
                        obj.breadcrumb = c.breadcrumb;
                        obj.backPath = element.path;

                        this.breadcrumbs = obj;
                        break;
                    }
                }
            }
            this.resetMenu();
        });
    }
    ngOnInit(): void {
        this.getDictList();
        if (Global.menuList) {
            this.userInfo = Global.menuList.user;
            this.menuData = Global.menuList.menu;
            this.resetMenu();
        } else {
            this.menuList();
        }
    }
    /**
    * Returns array of IBreadcrumb objects that represent the breadcrumb
    *
    * @class DetailComponent
    * @method getBreadcrumbs
    * @param {ActivateRoute} route
    * @param {string} url
    * @param {IBreadcrumb[]} breadcrumbs
    */
    private getBreadcrumbs(route: ActivatedRoute) {
        const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

        //get the child routes
        let children: ActivatedRoute[] = route.children;

        //return if there are no more children
        if (children.length === 0) {
            return;
        }

        //iterate over each children
        for (let child of children) {
            let c: any = child;
            //verify primary route
            if (c.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            //verify the custom data property "breadcrumb" is specified on the route
            // if (c.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
            if (c.children.length == 0) {
                this.activeRoutin = c.snapshot.url[0].path;
            }

            // }
            this.getBreadcrumbs(c);
        }
    }

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }
    /**
     * 刷新缓存
     */
    refreshCache() {
        this.CacheLoadingOne = true;
        // 并联请求
        const post1 = this.AppService.refreshCache(1)
            .pipe((data) => {
                return data;
            });
        const post2 = this.AppService.refreshCache(2)
            .pipe((data) => {
                return data;
            });
        const post3 = this.AppService.refreshCache(3)
            .pipe((data) => {
                return data;
            });
        forkJoin([post1, post2, post3])
            .subscribe((data: any) => {
                if (data[0].code != 0) {
                    this.createMessage("error", "系统异常，请稍后再试！");
                }
                this.createMessage("success", "数据缓存刷新成功");
                this.CacheLoadingOne = false
            }, err => {
                this.createMessage("error", "系统异常，请稍后再试！");
                this.CacheLoadingOne = false
            });
    }

    toRouter(path: string) {
        // if (this.router.url.indexOf(path) === -1) {

        this.router.navigate([path]);
        // this.resetMenu();
        // }
    }
    breadcrumbsPaht(path: string) {
        this.router.navigate([path]);
    }
    /**
     * 退出登录
     */
    exit() {
        this.HomeService.exit().subscribe((res: any) => {
            this.createMessage("success", "成功退出登录");
            Global.UP = null;
            for (const key in RoutingCache.handlers) {
                RoutingCache.deleteRouteSnapshot(key);
            }
            this.router.navigate(['login']);
        }, err => {
        });
    }
    /**
     * 查询菜单列表
     */
    menuList() {
        this.HomeService.menuList().subscribe((res: any) => {
            if (res.code != 0) {
              this.createMessage("error", "菜单获取失败");
              return;
            }
            this.userInfo = res.data.user;
            this.menuData = res.data.menu;
            this.resetMenu();
        }, err => {
        });
    }
    /**
     * 重置菜单
     */
    resetMenu() {
        if (!this.menuData) { return; }
        this.navData = [];
        for (let index = 0; index < this.menuData.length; index++) {
            const element = this.menuData[index];
            let arr = [];
            if (element.isHide == 1 || element.isHide == null) {
                for (let k = 0; k < element.children.length; k++) {
                    const c = element.children[k];
                    let selected = this.breadcrumbs.path.split("/")[1] == c.path.split("/")[1] ? true : false;
                    if (c.isHide == 1 || c.isHide == null) {
                        arr.push({
                            name: c.name,
                            path: c.path,
                            selected: selected
                        });
                    }
                }
                let open = arr.filter(function (item: any) { return item.selected == true; }).length == 0 ? false : true;
                this.navData.push({
                    name: element.name,
                    icon: element.icon,
                    open: open,
                    children: arr,
                });
            }
        }
    }
    /**
     * 主窗口滚动 
     * @param currentY 滑动位置
     * @param targetY  滑动动画时间
     */
    ScrollTop(number: any, time: any) {
        if (!time) {
            this.mainScroll.nativeElement.scrollTop = number;
            return number;
        }
        const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
        let spacingInex = time / spacingTime; // 计算循环的次数
        let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
        let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离

        let scrollTimer = setInterval(() => {
            if (spacingInex > 0) {
                spacingInex--;
                this.ScrollTop(nowTop += everTop, null);
            } else {
                clearInterval(scrollTimer); // 清除计时器
            }
        }, spacingTime);

    }
    /**
    * 打开角色信息模态框 初始化
    * @param id 
    */
    showRoleModal(id: any = null): void {
        this.passwordModal = true;
    }

    /**
     * 模态框关闭触发
     */
    handleCancel(): void {
        this.passwordModal = false;
        this.accountModal = false;
    }
    /**
     * 修改密码
     */
    revisePwd() {
        if (this.messageId != null) {
            return;
        }
        if (!this.entityParam.oldPwd) {
            return this.createMessage("warning", "原密码不能为空");
        }

        if (!this.entityParam.passWord) {
            return this.createMessage("warning", "新密码不能为空");
        }

        if (!this.entityParam.affirmPassWord) {
            return this.createMessage("warning", "确认密码不能为空");
        }
        if (this.entityParam.affirmPassWord != this.entityParam.passWord) {
            return this.createMessage("warning", "新密码和确认密码不一致");
        }

        this.createBasicMessage();
        this.entityParam.accountNumber = this.userInfo.accountNumber;
        this.HomeService.revisePwd(this.entityParam).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                return this.createMessage("error", res.message);
            }
            this.handleCancel();
            this.createMessage("success", "修改密码成功，请重新登录");
            Global.UP = null;
            this.router.navigate(['login']);
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        });
    }

    /**
     * 账号信息
     */
     showAccountModal(id: any = null) {
        this.accountModal = true;

        this.HomeService.details(id).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            const tabData = res.data;
            this.accountParam.id = tabData.id;
            this.accountParam.userName = tabData.userName;
            this.accountParam.realName = tabData.realName;
            this.accountParam.phoneNumber = tabData.phoneNumber;
            this.accountParam.name = tabData.name;
            this.accountParam.img = tabData.img;
            this.accountParam.roleId = tabData.roleId;
            this.accountParam.state = tabData.state + "";
            this.accountParam.isFirst = tabData.isFirst;
            this.accountParam.sort = tabData.sort;
            this.accountParam.remarks = tabData.remarks;
        }, err => {

        })
    }

    /**
     * 账号信息保存
     */
    accountSave() {
        // const json = {
        //     userName: this.accountParam.userName,
        //     phoneNumber: this.accountParam.phoneNumber,
        //     name: this.accountParam.name,
        //     img: this.accountParam.img,
        // }
        if (this.messageId != null) {
            return;
        }
        if (!this.accountParam.realName) {
            this.createMessage('warning', '请输入姓名');
            return;
        }
        this.createBasicMessage();
        this.HomeService.update(this.accountParam).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                return this.createMessage('error', res.message);
            }
            this.createMessage('success', '修改成功');
            this.handleCancel();
            this.menuList();
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        });
    }

    /**
   * 文件上传完成回调
   * @param files 
   */
    handleFileInput(files: any) {
        let fileArr = files.target.files;
        console.log(files.target.files);
        for (let index = 0; index < fileArr.length; index++) {
            const element = fileArr[index];
            this.postFile(element, (res: any) => {
                if (res.code != 0) {
                    return;
                }
                this.accountParam.img = res.data;
            });
        }
    }
    /**
     * 删除图片
     */

    deleteImg() {
        this.accountParam.img = "";
        this.fileVal = "";
    }

    /**
     * 上传文件
     * @param su 上传完成回调函数
     */
    postFile(file: any, su: any) {
        this.HomeService.postFile(file).subscribe(data => {
            if (su) su(data);
        }, error => {

        });
    }
    /**
     * 
     */
    openMenu(e: any) {
        for (const key in this.navData) {
            const element = this.navData[key];
            element.open = false;
        }
        e.open = true;
    }
    /**
     * 获取字典列表
     */
    getDictList() {
        this.ConfigDictService.getDictList({ name: "", pageNum: 1, pageSize: 99 }).subscribe((res: any) => {
            Global.dictData = res.data.list;
        }, err => {
        });
    }

    /**
     * 开启loading
     */
    createBasicMessage(): void {
        this.messageId = this.message.loading('正在登录...', { nzDuration: 0 }).messageId;
    }
    /**
     * 移除loading
     */
    removeBasicMessage() {
        this.message.remove(this.messageId);
        this.messageId = null;
    }
    /**
     * 全局展示操作反馈信息
     * @param type 其他提示类型 success:成功 error:失败 warning:警告
     */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}
