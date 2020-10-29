import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { GetousService } from "../../services/getous.service";
import { first } from 'rxjs/operators';
import { commonCtrl } from "../../common/common";
import { AlertController,NavController } from '@ionic/angular';
import { GetpersoninfoService } from "../../services/getpersoninfo.service";
import { GetallformsService } from "../../services/getallforms.service";
import { GetAppPortalService } from '../../services/get-app-portal.service';

@Component({
  selector: 'app-updatedownload',
  templateUrl: './updatedownload.page.html',
  styleUrls: ['./updatedownload.page.scss'],
})
export class UpdatedownloadPage implements OnInit {
  public public:any;
  public download:any;
  public cbgcolor:any;
  public downtemplate:boolean = false;
  public downou:boolean = false;
  public downemp:boolean = false;
  public downportal:boolean = false;
  public downlog:boolean = false;
  public loginDetails:any;
  public lan:string = "en";
  constructor(
    public translate: TranslateService,
    private storage: Storage,
    private getou: GetousService,
    private commonCtrl: commonCtrl,
    public alertController: AlertController,
    private getpsn: GetpersoninfoService,
    private getallforms: GetallformsService,
    public geapp: GetAppPortalService,
  ) { 
    this.translate.get('download').subscribe(d => {
      this.download = d;
    })
    this.translate.get('public').subscribe(d => {
      this.public = d;
    })
    if (localStorage.getItem("bgcolor")) {
      this.cbgcolor = `--color:${localStorage.getItem('bgcolor')};--color-selected:${localStorage.getItem('bgcolor')}`;
    }
    if (localStorage.getItem("lan")) {
      this.lan = localStorage.getItem("lan");
    }
    this.storage.get("loginDetails").then(data => {
      this.loginDetails = data;
    })
  }

  ngOnInit() {
  }
  downouInfo(){
    this.storage.get("loginDetails").then(data => {
      this.getou.getous(data.username, data.password, data.server, data.folder,'').pipe(first()).subscribe(
        data => {        
          
          data = JSON.parse(data.data);
          if(!data.action){
            this.storage.set('ous', JSON.stringify(data.oudata));
            this.storage.set("oumodify",data.oumodify);
          }
          this.commonCtrl.processHide();
        }
      )
    })
  }
  downlogPic(){
    this.storage.get("loginDetails").then(data => {
      this.getou.getLoginPic({username:data.username, password: data.password, code: data.code},"").pipe(first()).subscribe(data => {
        if (data.data.indexOf('DOCTYPE') == -1) {
          data = JSON.parse(data.data);
          console.log('getportal pic:',data,'--pic:',data.HeaderCompanyLogo)
          if(!data.action){
            this.storage.set('HeaderCompanyLogo', JSON.stringify(data));
            this.storage.set('compicmodify', data.modify);
          }
          if(!this.downou) this.commonCtrl.processHide();
        }     
      });
    })
  }
  downempInfo(){
    this.storage.get("loginDetails").then(data => {
      this.getpsn.getpersoninfo(data.username, data.password, data.server, data.folder,"","downall").pipe(first()).subscribe(
        data => {
          const otime = new Date();
          data = JSON.parse(data.data);
          if(!data.action){
            console.log('getpersoninfo:',data);
            this.storage.set('psninfo', JSON.stringify(data));
            this.storage.set('pinfoModify', data.empCount);
          }
          if(!this.downou) this.commonCtrl.processHide();
        }
      )
    })
  }
  downformInfo(){
    this.getallforms.getAllForms(this.loginDetails,this.lan).pipe(first()).subscribe(data => {
      this.commonCtrl.processHide();
      data = JSON.parse(data.data);
      this.storage.set('allforms', JSON.stringify(data));  
      if(!this.downou) this.commonCtrl.processHide(); 
    })
  }
  downportalInfo(){
    this.geapp.getPortalInfo(this.loginDetails, this.lan, "").pipe(first())
      .subscribe(data => {
        if(!data.action){
          console.log("-----ddd:",data);
          this.storage.set("offlinePortalInfo", data);
          this.storage.set("portalmodify",data.modify);
        }
        if(!this.downou) this.commonCtrl.processHide(); 
      })
  }
  downloadAll(){
    if(this.downou || this.downlog || this.downemp || this.downtemplate || this.downportal){
      this.commonCtrl.processShow(`${this.download.loading}`+"...");
      if(this.downou==true){
        this.downouInfo();
      }
      if(this.downlog==true){
        this.downlogPic();
      }
      if(this.downemp==true){
        this.downempInfo();
      }
      if(this.downtemplate==true){
        this.downformInfo();
      }
      if(this.downportal==true){
        this.downportalInfo();
      }
      this.presentAlert(`${this.download.finished}`, "", [{
        text: "OK",
        handler: () => {
          this.downtemplate = false;
          this.downou = false;
          this.downemp = false;
          this.downportal = false;
          this.downlog = false;
        }
      }]);
    }
  }
  async presentAlert(msg: string, header: string, btn: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: msg,
      buttons: btn
    });

    await alert.present();
  }

}
