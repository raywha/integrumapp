import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators'
import { CommonService } from '../common.service';
import { HTTP } from '@ionic-native/http/ngx';
import {AppConfig } from '../../config';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public http: HttpClient,private common:CommonService,private httpnative: HTTP, private platform: Platform) { }
  
  getAccount(email: string): Observable<any> {
    const url:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/getMyAccount?email=${email}`;
    return from(this.httpnative.get(url,'','').catch(e=>{
      console.log('service ..getAccount error....',e)

      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
   
  };
  getReleaseInfo(): Observable<any> {
    let os:string = "Android";
    if(this.platform.is('ios')){
      os = "iOS";
    }
    let url:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/getReleaseInfo?os=${os}`;
    return from(this.httpnative.get(url,'','').catch(e=>{
      console.log('service ..getReleaseInfo error....',e)

      if(e.status==-6) return {data:"{\"returnResponse\":\"offline\"}"};
    }));
   
  };
  
}
