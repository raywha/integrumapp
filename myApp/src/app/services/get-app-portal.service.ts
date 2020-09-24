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

  getPortalInfo(logindetail:any, lan?:string): Observable<any> {
    //console.log('getProtalInfo---->',logindetail)
    let email = logindetail.email && logindetail.email!=''?logindetail.email:localStorage.getItem('email');
    let browerLang=this.translate.getDefaultLang();
    if(lan){
      browerLang = lan;
    }
    let params:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getAppPortal?&email=${encodeURIComponent(logindetail.email)}&lan=${browerLang}`;
    //console.log('getProtalInfo url:',params)
    if(logindetail.username && logindetail.password){
      
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      
      return from(this.httpnative.get(params,"",options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(params,"",'').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));

    
    
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
    let browerLang=this.translate.getDefaultLang();
    if(localStorage.getItem('lan')){
      browerLang = localStorage.getItem('lan');
    }
    let params:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getViewData?viewid=${encodeURIComponent(key)}&countperpage=${encodeURIComponent(count)}&curpage=${encodeURIComponent(curpage)}&languageid=${encodeURIComponent(browerLang)}`;
    if(key && key != ''){
      if(key.startsWith('My_') || key.startsWith('my_')) params = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getMyViewData?viewid=${encodeURIComponent(key)}&uname=${encodeURIComponent(logindetail.username)}&languageid=${encodeURIComponent(browerLang)}`;
    }
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
    
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(params,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(params,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }

  getActDocsAssoForms(logindetail:any,para:any ):Observable<any>{
    let key=para.key
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActDocsAssoForms?unid='+encodeURIComponent(key),'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActDocsAssoForms?unid='+encodeURIComponent(key),'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
}
