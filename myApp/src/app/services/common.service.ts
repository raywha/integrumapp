import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public storage:Storage
  ) { 
  

  }


  public handleError (error: Response | any) {
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
  }



  async getDataStorage(key:any): Promise<any>{
    return new Promise(resolve => {
      this.storage.get(key).then( res => resolve(res))
    });
  }

}
