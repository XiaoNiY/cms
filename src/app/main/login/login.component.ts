import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { LoginService } from './login.service';
import { Global } from '../../shared/global';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  messageId: string = "";
  constructor(
    private LoginService: LoginService,
    private message: NzMessageService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      accountNumber: ["", [Validators.required]],
      passWord: ["", [Validators.required]],
      // 系统
      system: null,
      // 浏览器
      browser: null,
    });

  }
  submitForm(): void {
    if (this.messageId != "") {
      return;
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let obj = this.getBrowserInfo();
    this.validateForm.value.system = obj.system;
    this.validateForm.value.browser = obj.browser;

    this.createBasicMessage();
    this.LoginService.login(this.validateForm.value).subscribe((res: any) => {
      if (res.code != 0) {
        return this.createMessage("error", res.message);
      }
      Global.UP = res.data;
      this.menuList();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });

  }
  /**
   * 查询菜单列表
   */
  menuList() {
    this.LoginService.menuList().subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        return this.createMessage("error", "菜单初始化失败");
      }
      this.createMessage("success", "登录成功");
      Global.menuList = res.data;
      this.router.navigate([res.data.menu[0].children[0].path]);
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 获取浏览器名字
   * @returns 
   */
  getBrowserInfo() {
    let obj = {
      // 系统
      system: "Unknown",
      // 浏览器
      browser: "Unknown",
    }
    let userAgent: any = navigator.userAgent.toLowerCase();
    let regStr_ie = /msie [\d.]+;/gi;
    let regStr_ff = /firefox\/[\d.]+/gi
    let regStr_chrome = /chrome\/[\d.]+/gi;
    let regStr_saf = /safari\/[\d.]+/gi;


    try {

      //IE
      if (userAgent.indexOf("msie") > 0) {
        obj.browser = userAgent.match(regStr_ie)[0];
      }
      //firefox
      if (userAgent.indexOf("firefox") > 0) {
        obj.browser = userAgent.match(regStr_ff)[0];
      }
      //Chrome
      if (userAgent.indexOf("chrome") > 0) {
        obj.browser = userAgent.match(regStr_chrome)[0];
      }
      //Safari
      if (userAgent.indexOf("safari") > 0 && userAgent.indexOf("chrome") < 0) {
        obj.browser = userAgent.match(regStr_saf)[0];
      }

      if (userAgent.indexOf('win') > -1) {
        obj.system = 'Windows';
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          obj.system = 'Windows 2000';
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
          obj.system = 'Windows XP';
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          obj.system = 'Windows Vista';
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
          obj.system = 'Windows 7';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
          obj.system = 'Windows 8';
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          obj.system = 'Windows 8.1';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
          obj.system = 'Windows 10';
        } else {
          obj.system = 'Unknown';
        }
      } else if (userAgent.indexOf('iphone') > -1) {
        obj.system = 'Iphone';
      } else if (userAgent.indexOf('mac') > -1) {
        obj.system = 'Mac';
      } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
        obj.system = 'Unix';
      } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
          obj.system = 'Android';
        } else {
          obj.system = 'Linux';
        }
      } else {
        obj.system = 'Unknown';
      }
    } catch (error) {

    }
    return obj;
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
    this.messageId = "";
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning:警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
