import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
//
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
 
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private translate:TranslateService
  ) {
    let hasLogged=localStorage.getItem('hasLogged');
    console.log("hasLogged="+hasLogged)
    if(hasLogged=="true"){
      console.log("找到登录状态，设置")
      this.router.navigate(['tabs/tab1'])
    }
    this.initializeApp();
    this.initTranslate();
    this.isUserAgent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  initTranslate(){
    //设置默认语言，一般在无法匹配的时候使用
    this.translate.setDefaultLang('en');
    //获取当前浏览器的语言
    // let broswerLang=this.translate.getBrowserLang();
    // if (this.translate.getBrowserLang() !==undefined){
    //   this.translate.use(this.translate.getBrowserLang());
    // }else {
    //   this.translate.use('zh');
    // }
    
  //   let bIsIpad=userAgent.match(/ipad/i)=='ipad';
  //  console.log(bIsIpad,'ipad')
  //  //判断是否是iphone
  //  let bIsIpone=userAgent.match(/iphone/i)=='iphone';
  //  console.log(bIsIpone,'iphone')
  //   //判断安卓
  //  let bISAdndroid=userAgent.match(/androis/i)=='android';
  //  console.log(bISAdndroid,'android')
  }
  isUserAgent(){
    var u = navigator.userAgent, app = navigator.appVersion;
    console.log(app)
    var isAndroid = (/android/gi).test(app)
    var isIOS = (/iphone/gi).test(app); //ios终端
    let isTouchPad=(/ipad/gi).test(app);
    if (isAndroid) {
        // console.dir('android')
    }
    if (isIOS) {
        // window.location.href = 'iosDownload.html';
        // console.dir('iphone')
    }
  }
}
