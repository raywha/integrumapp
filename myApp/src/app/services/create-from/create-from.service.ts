import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { CommonService } from '../common.service';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class CreateFromService {

  constructor(private http: HttpClient,private common:CommonService,private httpnative: HTTP) { }
  
  getAction(logindetail:any,key:any): Observable<any> {
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      //http://oa.jf81.com/sfv3/integrumws.nsf/xp_App.xsp/getActDocFormData?unid=1A9D2024BB1EA9E4482584BE007DBC3E
      return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActDocsAssoForms?unid='+key,'',options))
    }
    return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActDocsAssoForms?unid='+key,'',''))
 }
  getPersonInfo(logindetail:any,key:any): Observable<any> {
    if(logindetail.username && logindetail.password){
      let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      //http://oa.jf81.com/sfv3/integrumws.nsf/xp_webservices.xsp/getPersonInfo?username=yuan%20tian
      return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_webservices.xsp/getPersonInfo?username='+key,'',options));
    }
    return from(this.httpnative.get(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_webservices.xsp/getPersonInfo?username='+key,'',''));

  }
  getActionSava(logindetail:any,params:any): Observable<any> {
    let  data=new HttpParams().set("pid",params.pid).set("actTitle",params.actTitle)
    .set("actAssignee",params.actAssignee).set("actDesc",params.actDesc).set('actDueDate',params.actDueDate)
    .set('actAtt',params.actAtt).set('actPriority',params.actPriority).set('actPriorityTitle',params.actPriorityTitle)
    .set('actionRevToInitiator',params.actionRevToInitiator); 
    let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
    const options = {
      headers: {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
      }
    };
    //http://oa.jf81.com/sfv3/smformdata.nsf/xp_smartFormWs.xsp/createActionDoc?
    //pid=555DEF88C9657A7E482584B90020ECC0&actTitle=Action+title01&actAssignee=zhen+ding
    //&actDesc=Description%3A&actDueDate=2019-12-03&actAtt=&actPriority=Minor
    //&actPriorityTitle=Minor&actionRevToInitiator=true
    return this.http.post<{token: string}>(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_smartFormWs.xsp/createActionDoc',data,options)
      .pipe(
        map(result => { 
                 console.log(result);
                 return result;
        }),
        catchError(this.common.handleError)
      )
    
  }
  getPriority(logindetail:any): Observable<any> {
    let auth='Basic '+btoa(logindetail.username+':'+logindetail.password);
    const options = {
      headers: {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
      }
    };
    //http://oa.jf81.com/sfv3/integrumws.nsf/xp_webservices.xsp/getPersonInfo?username=yuan%20tian
    return this.http.get<{token: string}>(logindetail.server+'/'+logindetail.folder+'/integrumws.nsf/xp_App.xsp/getActPriority',options)
      .pipe(
        map(result => { 
             return result;
        }),
        catchError(this.common.handleError)
      )
  }
}
