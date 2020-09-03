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
  
  getAccount(userid: string,pass:string,email:string,domain:string,folder:string): Observable<any> {
    //let auth='Basic '+btoa(userid+':'+pass);
    //const options = {
    //    "Content-Type":"application/json; charset=utf-8",
    //    "Authorization":auth
    //};
    let url:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/getMyAccount?email=${email}`;
    return from(this.httpnative.get(url,'',''));
   
  };
  getReleaseInfo(): Observable<any> {
    let os:string = "Android";
    if(this.platform.is('ios')){
      os = "iOS";
    }
    let url:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/getReleaseInfo?os=${os}`;
    return from(this.httpnative.get(url,'',''));
   
  };
  
}
