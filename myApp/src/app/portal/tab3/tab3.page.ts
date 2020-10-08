import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { LogoutService } from '../../services/logout/logout.service';
import { first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public public: any;
  public offlineFlag: boolean = true;
  public titlelog :string ;
  public portalTile: string;
  public cbgcolor:string;
  
  constructor(
    private storage: Storage,
    public translate: TranslateService,
    public logoutService: LogoutService,
    public alertController: AlertController,
    public Nav: NavController,
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
