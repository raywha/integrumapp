import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class GetallformsService {

  constructor(public translate :TranslateService,private http: HttpClient,private common:CommonService,private httpnative: HTTP) { }

  getAllForms(logindetail:any ):Observable<any>{
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getAllForms?ver=v2&languageid','',options));
    }
    return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getAllForms?ver=v2&languageid','',''));
  }


  getFormData(logindetail:any,para:any ):Observable<any>{
    let unid=para.unid
    let isedit = para.isedit;
    let param:string = logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getDocInfoV2?unid='+encodeURIComponent(unid)+'&isedit='+encodeURIComponent(isedit);
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options));
    }
    return from(this.httpnative.get(param,'',''));
  }
  submit(logindetail:any,para:any ):Observable<any>{
    let  data=para
    this.httpnative.setDataSerializer("json");
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      let unid=para.unid
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      console.log('para:',para)
      
      return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/submitFormV2',data,options));
    }
    return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/submitFormV2',data,''));
  }
  getLoopupOptions(logindetail:any,para:any):Observable<any>{
    let key=para.key;
    let db = para.db;
    let view = para.view;
    let column = para.column;
    
    let sparas:string = `&db=${encodeURIComponent(db)}&view=${encodeURIComponent(view)}&column=${encodeURIComponent(column)}`;
    let param:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getLookupOption?key=${encodeURIComponent(key)}${sparas}`
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options));
    }
    return from(this.httpnative.get(param,'',''));
  }
  doDeleteDoc(logindetail:any,para:any):Observable<any>{
    const unid:string = para.unid;
    const cm:string   = para.cm;
    let param:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/deleteDoc?unid=${encodeURIComponent(unid)}$cm=${encodeURIComponent(cm)}`
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options));
    }
    return from(this.httpnative.get(param,'',''));

  }

}
