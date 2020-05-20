import { Injectable } from '@angular/core';
import {HttpClient, HttpParams } from "@angular/common/http";
import { TranslateLoader } from '@ngx-translate/core';
import { Observable,from, } from 'rxjs'; 
import { catchError,map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Storage } from '@ionic/storage';
import {AppConfig } from '../config';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable()
export class CustomTranslateLoader implements TranslateLoader  {
    contentHeader = new Headers({"Content-Type": "application/json","Access-Control-Allow-Origin":"*"});

    constructor(private http: HttpClient, public common:CommonService,private storage:Storage,private httpnative: HTTP ) {}
    
    getTranslationV2(lang: string): Observable<any> {
        console.log('------server-------',AppConfig.domain);
        console.log('------folder-------',AppConfig.folder);
        const curl:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/multiLan?lan=${encodeURIComponent(lang)}`;
        console.log('---------curl-------',curl);
        this.httpnative = new HTTP();
        this.httpnative.get(curl,"",'')
        console.log('---------222222-------');
        console.log(this.httpnative.get(curl,"",''))
        return from(this.httpnative.get(curl,"",''))
          
      }
      getTranslation(lang: string): Observable<any>{
      
        // let auth='Basic '+btoa("ShiJun Tian"+':'+"mrt6627");
        // const options = {
        //   headers: {
        //     "Content-Type":"application/json; charset=utf-8",
        //     "Authorization":auth
        //   }
        // };
        const curl:string = `${AppConfig.domain}/${AppConfig.folder}/appmgt.nsf/xp_ws.xsp/multiLan?lan=${encodeURIComponent(lang)}`;
        this.httpnative = new HTTP();
        return Observable.create(observer => {

          this.httpnative.get(curl, "",'').then((res) => {
              res = JSON.parse(res.data);
                    observer.next(res);
                    observer.complete();               
                },
           error => {
               //  failed to retrieve from api, switch to local
               this.httpnative.get(curl,'',"").then((res) => {
                   res = JSON.parse(res.data);
                    observer.next(res);
                   observer.complete();               
               })
           }
           );
      }); 
       
      }
}