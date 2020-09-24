import { Component, OnInit } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  providers:[DatePipe]
})
export class AccountPage implements OnInit {
  public accountData:any={
  };

  constructor(
    public translate :TranslateService,
    public http:HttpClient,
    private storage:Storage,
    private datePipe: DatePipe
    ) { 
    
  }
//http://oa.jf81.com/sfv3/integrumws.nsf/xp_App.xsp/getMyAccount?email=zding@jf81.com
  ngOnInit() {
    this.storage.get("accountData").then(data=>{
      data = JSON.parse(data);
      console.log('storage account data:',data)
      this.accountData = data;
      this.getLan();
    })
    
  }

 getLan(){
    //获取当前设置的语言
    let browerLang=this.translate.getDefaultLang();
    console.log(browerLang)
   if(this.accountData.language==browerLang){
    this.storage.get("apptranslation").then(data=>{
      data = JSON.parse(data);
      console.log('apptranslation:',data);
       const v: any = data.Languages.find( item => item.SelectedLanguages == this.accountData.language);
       if(v) this.accountData.language=v.NativeNames;
    })
   }else{
    this.storage.get("apptranslation").then(data=>{
      data = JSON.parse(data);
      console.log('apptranslation:',data);
       const v: any = data.Languages.find( item => item.SelectedLanguages == browerLang);
       if(v) this.accountData.language=v.NativeNames;
    })
   }
 
 }

}
