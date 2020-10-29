import { Component, OnInit} from '@angular/core';
import { PopoverController, NavParams, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  public setting: any = [];
  public type: string;
  public portalList: any = [];
  public setupPortalList: any = [];
  public selectPortalIndex: number = 0;
  public offlineFlag: boolean = true;

  constructor(public nav: NavController, public Popover: PopoverController, public translate: TranslateService,
    public params: NavParams,
    private storage: Storage,
    public alertController: AlertController,
    public router:Router
  ) {
    this.offlineFlag = localStorage.getItem('offlineFlag')?(localStorage.getItem('offlineFlag')=="false"?false:true):false;
    this.translate.get('setting').subscribe(res => {
      this.setting = res;
    })
    this.type = this.params.get("type")
    if(this.type=='setup') {
      this.selectPortalIndex = this.params.get('selectPortalIndex');
      this.setupPortalList = this.params.get("portal").items;
    }
    if(this.params.get("portal")){
      let plist = this.params.get("portal").items;
      let userallportal = this.params.get("portal").userallportal;
      if(userallportal){
        for (let i = 0; i < userallportal.length; i++) {
          const element = userallportal[i];
          let v = plist.find(e=>e.Title == element);
          if(v) this.portalList.push(v);
        }
      }else{
        this.portalList = this.params.get("portal").items
      }
    }
   
  }

  ngOnInit() {

  }
  ngAfterViewInit() {

    let popover = document.querySelector('.popover-content');
    popover['style'].width = 'auto';
    popover['style'].height = '18rem'
  }
  getLink(code) {
    if (code == 1) {
      this.Popover.dismiss()
      this.nav.navigateBack('account');
    } else if (code == 2) {
      this.Popover.dismiss()
      //this.nav.navigateBack('language');
      this.nav.navigateBack('language',{queryParams:{selectPortalIndex:this.setupPortalList}})
    } else if (code == 3) {
      this.Popover.dismiss()
      // this.nav.navigateBack('add-action');
      if(this.offlineFlag){
        this.nav.navigateBack('offline');
      }else{
        this.nav.navigateBack('online');
      }
      
    }else if (code == 4) {
      this.Popover.dismiss()
      // this.nav.navigateBack('add-action');

      this.nav.navigateBack('lastrelease');
    }else if (code == 6) {
      this.Popover.dismiss()
      // this.nav.navigateBack('add-action');

      this.nav.navigateBack('defaulthome',{queryParams:{portalList:this.setupPortalList}});
    }else if (code == 7) {
      this.Popover.dismiss()
      // this.nav.navigateBack('add-action');
      this.nav.navigateBack('updatedownload');
    }else{
      let paramsSet=this.params.get("portalTile")
      console.log(paramsSet)
     // let lan=this.translate.getDefaultLang();
      if(this.offlineFlag){
        this.storage.get('offlinemuitldata').then(d => {
          d = JSON.parse(d);
          console.log('d:', d)
          this.presentAlert(`${d.online.notLogout}<br/>${d.online.logoutTip}`, "", [{
            text: 'OK',
            handler: () => {
              this.Popover.dismiss();
            }
          }]);
        })
      } else {
        this.nav.navigateRoot('loginpass');
        localStorage.setItem('hasLogged', "false");
        this.Popover.dismiss();
      }
    }
  }
  getPortalLink(data,title){
    this.router.navigate(['tabs/tab1'], {queryParams: {key:data,title:title}});
    this.Popover.dismiss()
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

