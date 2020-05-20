import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(public http: HttpClient,private httpnative: HTTP) { }

  
  getAppTranslation(userid: string,pass:string,domain:string,folder:string): Observable<any> {
    if(userid && pass){
      let auth='Basic '+btoa(userid+':'+pass);
      const options = {
          "Content-Type":"application/json; charset=utf-8",
          "Authorization":auth
      };
      return from(this.httpnative.get(domain+'/'+folder+'/integrumws.nsf/xp_App.xsp/getAppTranslation','',options))
    }
    return from(this.httpnative.get(domain+'/'+folder+'/integrumws.nsf/xp_App.xsp/getAppTranslation','',''))
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err =  JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return "{'returnResponse':'failure'}";
  };
  

}
