import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class GetpersoninfoService {

  constructor(private http: HttpClient,private common:CommonService,private httpnative: HTTP) { }

getpersoninfo(userid: string,pass:string,domain:string,folder:string): Observable<any> {
  if(userid && pass){
    let auth='Basic '+btoa(userid+':'+pass);
    const options = {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization":auth
    };
    return from(this.httpnative.get(domain+'/'+folder+'/integrumws.nsf/xp_webservices.xsp/getPersonInfo?username='+encodeURIComponent(userid),'',options).catch(e=>{
      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
  }
  return from(this.httpnative.get(domain+'/'+folder+'/integrumws.nsf/xp_webservices.xsp/getPersonInfo?username='+encodeURIComponent(userid),'','').catch(e=>{
    if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
  }));
  }
}
