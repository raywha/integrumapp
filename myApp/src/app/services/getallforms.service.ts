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

  constructor(public translate :TranslateService,private http: HttpClient,private common:CommonService,private httpnative: HTTP) {  
    this.httpnative.setRequestTimeout(60*3);
  }

  getAllForms(logindetail:any, lan?:string):Observable<any>{
    let browerLang=this.translate.getDefaultLang();
    if(lan){
      browerLang = lan;
    }
    const curtime = new Date();
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getAllForms?ver=v2&languageid=${browerLang}`;
    console.log('getallforms url:',url);
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        console.log('getAllForms service error:',e);
        const otime = new Date();
        console.log('---->getAllForms--otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:', curtime.toLocaleTimeString());
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }


  getFormData(logindetail:any,para:any, lan?:string ):Observable<any>{
    let browerLang=this.translate.getDefaultLang();
    if(lan){
      browerLang = lan;
    }
    let unid=para.unid
    let isedit = para.isedit;
    let param:string = logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getDocInfoV2?unid='+encodeURIComponent(unid)+'&languageid='+browerLang+'&isedit='+encodeURIComponent(isedit);
    console.log('getFormData  url:',param)
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  submit(logindetail:any,para:any ):Observable<any>{
    let  data=para;
    console.log("------before decode---",data);
    data = {"data":escape(JSON.stringify(data))};
    console.log("------after decode---",data);
    this.httpnative.setDataSerializer("json");
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      let unid=para.unid
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      console.log('para:',para)
      
      return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/submitFormV2',data,options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/submitFormV2',data,'').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  syncSave(logindetail:any,para:any ):Observable<any>{
    let  data=para
    data = {"data":escape(JSON.stringify(data))};
    this.httpnative.setDataSerializer("json");
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      let unid=para.unid
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      console.log('para:',para)
      
      return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/syncSave',data,options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/syncSave',data,'').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  isOnline(logindetail:any): Observable<any> {

    let  data={
      "Code": ""
    }
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth 
      };
      return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/doLoginSuccessAuth?OpenPage',data,options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/doLoginSuccessAuth?OpenPage',data,'').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));

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
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  doDeleteDoc(logindetail:any,para:any):Observable<any>{
    const unid:string = para.unid;
    const cm:string   = para.cm;
    let param:string = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/deleteDoc?unid=${encodeURIComponent(unid)}&cm=${encodeURIComponent(cm)}`
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));

  }
  inheritValue(logindetail:any,para:any):Observable<any>{
    let unid=para.mainunid;
    let param:string = logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/inheritValue?mainunid='+encodeURIComponent(unid);
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));       
  }
  submitToMr2(logindetail:any,para:any ):Observable<any>{
    let { unid,mr2 } = para;
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/invokeServerFunctions?unid=${unid}&action=sendforreview&strformMR=${encodeURIComponent(mr2)}`;
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  
  }
  doReAssign(logindetail:any,para:any):Observable<any>{
    const {unid, comments, formmr} = para;
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/invokeServerFunctions?unid=${unid}&action=reassign&formmr=${encodeURIComponent(formmr)}&comments=${encodeURIComponent(comments)}`;
    //const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/invokeServerFunctions?unid=${unid}&action=reassign&formmr=${formmr}&comments=${encodeURIComponent(comments)}`;
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
    
  }
  doApprove(logindetail:any,para:any):Observable<any>{
    const {unid, comments} = para;
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/invokeServerFunctions?unid=${unid}&action=approve&comments=${encodeURIComponent(comments)}`;
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
    
  }
  doReject(logindetail:any,para:any):Observable<any>{
    const {unid, comments} = para;
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/invokeServerFunctions?unid=${unid}&action=reject&comments=${encodeURIComponent(comments)}`;
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
    
  }
  doReopen(logindetail:any,para:any):Observable<any>{
    const {unid, comments} = para;
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/invokeServerFunctions?unid=${unid}&action=reopen&comments=${encodeURIComponent(comments)}`;
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
    
  }
  getPeopleByRole(logindetail:any,role:any):Observable<any>{
    let param:string = logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getPeopleByRole?role='+encodeURIComponent(role);
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  getDocData(logindetail:any,unid: string ):Observable<any>{
    let param:string = logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getFormData?key='+encodeURIComponent(unid);
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
    
  }
  removeDoc(logindetail:any,unid: string ):Observable<any>{
    let param:string = logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/removeMicroData?docid='+encodeURIComponent(unid);
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(param,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(param,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  saveMicrodbDoc(logindetail:any,para:any ):Observable<any>{
    let  data=para;
    this.httpnative.setDataSerializer("json");
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      let unid=para.unid
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      console.log('para:',para)
      
      return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/saveMicroData',data,options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.post(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/saveMicroData',data,'').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  getFieldValue(logindetail:any,fields: string, fullname: string):Observable<any>{
    const url = `${logindetail.server}/${logindetail.folder}/integrumws.nsf/xp_App.xsp/getFieldsValue?fields=${encodeURIComponent(fields)}&fullname=${encodeURIComponent(fullname)}`;
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);

      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(url,'',options).catch(e=>{
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }
    return from(this.httpnative.get(url,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
}
