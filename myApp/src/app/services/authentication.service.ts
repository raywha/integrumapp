import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { HTTP } from '@ionic-native/http/ngx';
import { AppConfig } from '../config';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private platform: Platform,private translate: TranslateService,private http: HttpClient,private common:CommonService,private httpnative: HTTP) { }

  login(userid: string,pass:string,domain:string,folder:string): Observable<any> {

    let  data={
      "Code": ""
    }
    if(userid && pass){
      let auth='Basic '+btoa(userid+':'+pass);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth 
      };
      return from(this.httpnative.post(domain+'/'+folder+'/integrumws.nsf/doLoginSuccessAuth?OpenPage',data,options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.post(domain+'/'+folder+'/integrumws.nsf/doLoginSuccessAuth?OpenPage',data,'').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));

  }

  
  
  sendEmail(code:string):Observable<any>{
    let s=new Date();
    let deviceid=s.getTime().toString()
    let  data= {
      "code": code
    }
  
    return from(this.httpnative.post(AppConfig.domain+'/'+AppConfig.folder+'/appmgt.nsf/xp_ws.xsp/UserAuthentication',data,""))
  }
  updateUserInfo(logindetail:any):Observable<any>{
    const {folder,username,email,code,OUCategory} = logindetail;
    const deviceid = "iphone12 001";
    const lan = this.translate.getDefaultLang() || localStorage.getItem("lan");
    let os:string = "Android";
    if(this.platform.is('ios')){
      os = "iOS";
    }
    const data = {
      username,
      email,
      "oucategory":OUCategory,
      code,
      deviceid,
      "devicettype":"iphone13 plus",
      os,
      lan
    }
    console.log('updateUserInfo---service---->',logindetail)
    console.log('url:',AppConfig.domain+'/'+AppConfig.folder+'/appmgt.nsf/xp_ws.xsp/updateUserInfo')
    console.log('data...',data)
    return from(this.httpnative.post(AppConfig.domain+'/'+AppConfig.folder+'/appmgt.nsf/xp_ws.xsp/updateUserInfo',data,"").catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
    
  }
  ssoData(serverAddr, serverFolder, data): Observable<any> {
    let url = serverAddr + '/' + encodeURIComponent(serverFolder);
    let addiUrl = '/integrumws.nsf/ssoAuth.xsp?' + 'key1=' + data.key1 + '&key2=' + data.key2 + '&timestamp=' + Date.now();
    // let addiUrl='/integrumws.nsf/doLoginSuccessAuth?openpage&'+'key1='+data.key1+'&key2='+data.key2+'&timestamp='+Date.now();
    console.log("for bt oauth sso ??????", url + addiUrl);
    return from(this.httpnative.get(url + addiUrl,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  getOfflineMultiData(): Observable<any> {
    const lan = this.translate.getDefaultLang() || localStorage.getItem("lan");
    const curl:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/multiLan?lan=${encodeURIComponent(lan)}`;

    return from(this.httpnative.get(curl,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
}
