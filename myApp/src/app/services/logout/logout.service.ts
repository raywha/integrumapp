import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { CommonService } from '../common.service';
import { HTTP } from '@ionic-native/http/ngx';
import {AppConfig } from '../../config'
@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient,private common:CommonService,private httpnative: HTTP) { }

  setLogout(userid: string,pass:string,email:string,language:string,protalGroup:any,domain:string,folder:string): Observable<any> {
    let params:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/Logout?&email=${encodeURIComponent(email)}&languageCode=${encodeURIComponent(language)}&portalGroup=${encodeURIComponent(protalGroup)}`;
console.log('setLogout  params:',params)
    if(userid && pass){
      let auth='Basic '+btoa(userid+':'+pass);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      //http://oa.jf81.com/sfv3/appmgt.nsf/xp_ws.xsp/Logout?&email=zding@jf81.com&languageCode=zh&portalGroup=app.integrum Group A
      return from(this.httpnative.get(params,'','').catch(e=>{
        console.log('setLogout error:',e)
        if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
      }));
    }

    return from(this.httpnative.get(params,'','').catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));

  }

}
