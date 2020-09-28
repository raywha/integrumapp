import { Component } from '@angular/core';
import { PopoverController,AlertController } from '@ionic/angular';
import { PopoverComponent } from './component/popover/popover.component';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StorageService } from '../../services/storage/storage.service';
import { GetAppPortalService } from '../../services/get-app-portal.service';
import { first } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LogoutService } from '../../services/logout/logout.service';
import { GetousService } from "../../services/getous.service";
import {AppConfig } from '../../config';
import { Router } from '@angular/router';
import { GetallformsService } from "../../services/getallforms.service";
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {
  public name: string;
  public type: string;
  public portalTile: string;
  public portalKey: string;
  public data = [

  ];
  public portalInfo: any;
  public loading: any;
  public processing:any;
  public listIco = { 'background': 'url(sfv3/appmgt.nsf//va_IconLib//collect.png//$FILE//collect.png) no-repeat top left' };
  public titlelog :string ;
  public sdomain:string;
  public folder:string;
  public cbgcolor = "#B81321";
  public offlineFlag: boolean = true;

  constructor(
    public popoverController: PopoverController,
    public Nav: NavController,
    private storage: Storage,
    public storageService: StorageService,
    public geapp: GetAppPortalService,
    public logoutService: LogoutService,
    public loadingController: LoadingController,
    public activeRoute: ActivatedRoute,
    public translate: TranslateService,
    private getallforms:GetallformsService,
    private getou:GetousService,
    private auth: AuthenticationService,
    private router:Router,
    public alertController: AlertController,
  ) {
    if(localStorage.getItem("bgcolor")){
      //console.log('localStorage-->bgcolor:',localStorage.getItem('bgcolor'))
      this.cbgcolor = localStorage.getItem('bgcolor');
    }else{
      console.log('not bgcolor:')
    }
    this.offlineFlag = localStorage.getItem('offlineFlag')?(localStorage.getItem('offlineFlag')=="false"?false:true):false;
    console.log('---router url:',this.router.url)
    this.sdomain = AppConfig.domain;
    this.folder = AppConfig.folder;
    this.show()
    this.storage.get("loginDetails").then(data => {
      let lan = this.translate.getDefaultLang();
      if(localStorage.getItem('lan')){
        console.log("localStorage.getItem('lan'):",localStorage.getItem('lan'),'--lan:',lan);
        this.activeRoute.queryParams.subscribe(res => {
          if (!res.lan) {
            if(localStorage.getItem('lan')!=lan){
              this.processShow('loading...');
              localStorage.setItem('lan',lan); 
              this.getallforms.getAllForms(data).pipe(first()).subscribe(data => {
                if (data.data.indexOf('DOCTYPE') == -1) {
                  data = JSON.parse(data.data);
                  console.log('over getallforms:',data)
                  this.storage.set('allforms', JSON.stringify(data));  
                  
                }else{
                  this.router.navigate(['authemail'])
                }
                 
                this.processHide();
            })
            this.auth.getOfflineMultiData().pipe(first()).subscribe(
              data => {
                console.log('getOfflineMultiData----data...:', JSON.parse(data.data))
                this.storage.set('offlinemuitldata', data.data);
              })
            
            }
            this.offlineFlag = localStorage.getItem('offlineFlag')?(localStorage.getItem('offlineFlag')=="false"?false:true):false;

            this.geapp.getPortalInfo(data).pipe(first())
            .subscribe(data => {
              if (data.data.indexOf('DOCTYPE') == -1) {
                data = JSON.parse(data.data);
                if(data.returnResponse == "offline"){
                  if(this.offlineFlag){
                    this.storage.get("offlinePortalInfo").then(d=>{
                      this.portalInfo = d;
                      if(!this.portalTile) this.portalTile = d.selectedPortal;
                      if(!this.data) this.data = this.getDataBykey(this.portalTile, "Title");
                      this.hide();
                    })
                  }else{
                    this.hide();
                    this.storage.get('offlinemuitldata').then(d => {
                      d = JSON.parse(d);
                      this.presentAlert(`${d.online.offlineTip}<br/>${d.online.ischangeOffline}`, "", [{
                        text: d.online.yes,
                        handler: () => {
                          this.offlineFlag = true;
                          localStorage.setItem('offlineFlag', this.offlineFlag + '');
                          this.Nav.navigateBack('/tabs/tab1',{queryParams:{title:this.portalTile}});
                        }
                      }, {
                        text: d.online.no,
                        handler: () => {
                        }
                      }
                      ]);
                    })
                  }
                }else{
                  this.portalInfo = data
                  this.portalTile = data.selectedPortal
                  this.storage.set("offlinePortalInfo", data);
                }
                console.log("----this.protal---",this.portalInfo);
                if (res.title) {
                  this.portalTile = res.title;
                }
                if (res.selectPortalIndex) {
                  let selectPortalIndex = res.selectPortalIndex;
                  if (selectPortalIndex < 0) selectPortalIndex = 0;
                  const title = this.portalInfo.items[selectPortalIndex].Title;
                  this.portalTile = title;
                }
                console.log("---portal title---:", this.portalTile);
                this.data = this.getDataBykey(this.portalTile, "Title")
                this.hide()    
              } else {
                this.router.navigate(['authemail'])
              }
            })

          }
        })
        
      }
      this.activeRoute.queryParams.subscribe(res => {
        if (res.lan) {
          this.geapp.getPortalInfo(data,res.lan).pipe(first())
          .subscribe(data => {
            if (data.data.indexOf('DOCTYPE') == -1) {
              data = JSON.parse(data.data);
              this.portalInfo = data
              this.portalTile = data.selectedPortal;
              this.data = this.getDataBykey(this.portalTile, "Title")
              this.hide()
            }else{
              this.router.navigate(['authemail'])
            }
          })
        }
      });
      
        // this.getou.getLoginPic(data).pipe(first()).subscribe(data => {
        //   if (data.data.indexOf('DOCTYPE') == -1) {
        //     data = JSON.parse(data.data);
        //     this.titlelog=data.HeaderCompanyLogo
        //   }else{
        //     this.router.navigate(['authemail'])
        //   }
          
          
        // });
        this.storage.get('HeaderCompanyLogo').then(d => {
          d = JSON.parse(d);
          console.log('portal picture:',d)
          this.titlelog=d.HeaderCompanyLogo;
        })
        
    })
    /*
    this.activeRoute.queryParams.subscribe(res => {
      console.log('activeRoute.queryParams:',res)
      this.portalTile = res.title
      if (res.key) {
        this.data = this.getDataBykey(res.title, "Title")
      }
    });
    */
  }

  ngOnInit() {

  }
  async presentPopover(ev: any) {
    let selectPortalIndex: number = 0;
    if(this.portalInfo){
      selectPortalIndex = this.portalInfo.items.findIndex(item => item.Title == this.portalTile)
    }
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { type: "setup", selectPortalIndex },
      translucent: true
    });
    return await popover.present();
  }
  async presentPopoverPortal(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { type: "portal", portal: this.portalInfo },
      translucent: true
    });
    return await popover.present();
  }
  logout() {
    //portalTile http://oa.jf81.com/sfv3/appmgt.nsf/xp_ws.xsp/Logout?&email=zding@jf81.com&languageCode=zh&portalGroup=app.integrum Group A
    console.log(this.portalTile)
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
  getInfo() {

  }
  async  show() {
    this.loading = await this.loadingController.create({
      message: 'loading....',
      duration: 2000
    });
    await this.loading.present();
  }
  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
  async processShow(message:string){
    this.processing = await this.loadingController.create({message,duration: 1000*60*5}); 
    await this.processing.present();
  }
  async processHide(){
    if(this.processing) await this.processing.dismiss();
  }
  getDataBykey(key: string, objkey: string): any {
    let res: any;
    if(this.portalInfo){
      if(!this.portalInfo.items){
        this.storage.get("offlinePortalInfo").then(d => {
          this.portalInfo = d;
          this.portalInfo.items.forEach(element => {
            if (element[objkey].trim() == key.trim() && element[objkey] != "") {
              res = this.getNoBlankData(element.allportal)
            }
          });
          return res
        })
      }else{
        this.portalInfo.items.forEach(element => {
          if (element[objkey].trim() == key.trim() && element[objkey] != "") {
            res = this.getNoBlankData(element.allportal)
          }
        });
        return res
      }
        
    }
   
  }
  getNoBlankData(data: any): any {
    let arr = [];
    let index = 0
    data.forEach(function (obj) {
      if (obj.LinkTitle != "") {
        // obj.index=index
        obj.SFMImage = "sfv3/" + obj.SFMImage
        arr.push(obj)
        //  index=index+1
      }
    })
    return arr;
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
