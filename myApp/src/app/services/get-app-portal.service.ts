import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { HTTP } from '@ionic-native/http/ngx';
import {AppConfig } from '../config';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class GetAppPortalService {

  constructor(public translate :TranslateService,private http: HttpClient,private common:CommonService,private httpnative: HTTP) { }

  getPortalInfo(logindetail:any): Observable<any> {
    console.log('getProtalInfo---->',logindetail)
    let email = logindetail.email && logindetail.email!=''?logindetail.email:localStorage.getItem('email');
    let params:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getAppPortal?&email=${encodeURIComponent(email)}`;

    if(logindetail.username && logindetail.password){
      let browerLang=this.translate.getDefaultLang();
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      let params:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getAppPortal?&email=${encodeURIComponent(logindetail.email)}&lan=${browerLang}`;
      return from(this.httpnative.get(params,"",options));
    }
    return from(this.httpnative.get(params,"",''));

    
    
  }
  getPortalInfoV2(logindetail:any):Observable<any>{
    //let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
    //const options = {
    //  "Content-Type":"application/json; charset=utf-8",
    // "Authorization":auth
    //};
    let params:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/getAppPortal?&email=${encodeURIComponent(logindetail.email)}`;
    return from(this.httpnative.get(params,"",''));
  }
  //sfv3/integrumws.nsf/xp_App.xsp/getViewData?key=Activity_form_New_Iberian&countperpage=10&curpage=4
  getViewData(logindetail:any,para:any ):Observable<any>{
    let key=para.key
    let count=para.count
    let curpage=para.curpage
    let params:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getViewData?viewid=${encodeURIComponent(key)}&countperpage=${encodeURIComponent(count)}&curpage=${encodeURIComponent(curpage)}`;
    if(key && key != ''){
      if(key.startsWith('my_')) params = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getViewData?viewid=${encodeURIComponent(key)}&countperpage=${encodeURIComponent(count)}&curpage=${encodeURIComponent(curpage)}&uname=${encodeURIComponent(logindetail.username)}`;
    }
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
    
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(params,'',options));
    }
    return from(this.httpnative.get(params,'',''));
  }

  getActDocsAssoForms(logindetail:any,para:any ):Observable<any>{
    let key=para.key
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActDocsAssoForms?unid='+encodeURIComponent(key),'',options));
    }
    return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActDocsAssoForms?unid='+encodeURIComponent(key),'',''));
  }
}
