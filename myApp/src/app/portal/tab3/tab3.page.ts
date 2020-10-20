import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { LogoutService } from '../../services/logout/logout.service';
import { GetAppPortalService } from '../../services/get-app-portal.service';
import { first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { commonCtrl } from "../../common/common";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [commonCtrl]
})
export class Tab3Page {
  public public: any;
  public offlineFlag: boolean = true;
  public titlelog :string ;
  public portalTile: string;
  public cbgcolor:string;
  public data:any;
  public databak:any;
  public para = {
    "count": "",
    "curpage": ""
  }
  public searchkey: any={
    "start":1,
    "count":10
  }
  
  constructor(
    private storage: Storage,
    public translate: TranslateService,
    public logoutService: LogoutService,
    public alertController: AlertController,
    public Nav: NavController,
    public geapp: GetAppPortalService,
    public commonCtrl: commonCtrl,
  ) {
    if(localStorage.getItem("bgcolor")){
      //console.log('localStorage-->bgcolor:',localStorage.getItem('bgcolor'))
      this.cbgcolor = localStorage.getItem('bgcolor');
    }
    this.translate.get("public").subscribe(d=>{
      this.public = d;
    })
    this.offlineFlag = localStorage.getItem('offlineFlag')?(localStorage.getItem('offlineFlag')=="false"?false:true):false;
    this.storage.get('HeaderCompanyLogo').then(d => {
      d = JSON.parse(d);
      this.titlelog=d.HeaderCompanyLogo;
    })
    this.getData();
  }
  ngOnInit() {
    console.log("------init")
  }
  logout() {
    let lan = this.translate.getDefaultLang();
    console.log(this.logoutService)
    if(this.offlineFlag){
      this.storage.get('offlinemuitldata').then(d => {
        d = JSON.parse(d);
        console.log('d:', d)
        this.presentAlert(`${d.online.notLogout}<br/>${d.online.logoutTip}`, "", ['OK']);
      })
    } else {
      this.storage.get("loginDetails").then(data => {
        this.logoutService.setLogout(data.username, data.password, data.email, lan, this.portalTile, data.server, data.folder).pipe(first())
          .subscribe(res => {
            console.log(res)
            res = JSON.parse(res.data);
            if (res.returnResponse == "offline") {
              this.storage.get('offlinemuitldata').then( d => {
                d = JSON.parse(d);
                console.log('d:',d)
                this.presentAlert(`${d.online.offlineTip}<br/>${d.online.ischangeOffline}`, "", [
                  {
                    text: d.online.yes,
                    handler: () => {
                      this.offlineFlag = true;
                      localStorage.setItem('offlineFlag', this.offlineFlag + '');
                    }
                  },
                  d.online.no]);
              })        
            } else if (res.status) {
              console.log('退出登录');
              this.Nav.navigateRoot('loginpass');
              localStorage.setItem('hasLogged', "false");
            }
          })
      })
    } 


  }
  getItems(ev: any) {
    this.data =this.databak
    let val = ev.target.value;
   //console.log(val)
    if (val && val.trim() != '') {
      this.data = this.databak.filter((item) => {
        
        if(item.FieldIDsForSearch){
          let v = item.FieldIDsForSearch.find(it=>it.includes(val) || it.toLowerCase().includes(val));
          if(v) return item;
        }else{
          if(item.title){
            return (item.actTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }
        }
      })
    }
  };
  loadData(event:any){
    this.searchkey.start=this.searchkey.start+1;
    this.storage.get("loginDetails").then(data => {
      this.para.count = this.searchkey.count
      this.para.curpage = this.searchkey.start
      this.geapp.getActData(data,this.para).pipe(first())
        .subscribe(data => {
          data = JSON.parse(data.data);
          this.data = this.data.concat( data.result);
          this.databak =this.data;
          event.target.complete();
          //this.commonCtrl.processHide();
        })
    })
  }
  getData() {
    //this.commonCtrl.processShow("loading....");
    this.storage.get("loginDetails").then(data => {
      this.para.count = this.searchkey.count
      this.para.curpage = this.searchkey.start
      this.geapp.getActData(data,this.para).pipe(first())
        .subscribe(data => {
          data = JSON.parse(data.data);
          this.data = data.result;
          console.log("----act data---:",this.data);
          this.databak = this.data;
          //this.commonCtrl.processHide();
        })
    })
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
