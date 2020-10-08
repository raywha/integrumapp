import { Component } from '@angular/core';
import { PopoverController,AlertController } from '@ionic/angular';
import { PopoverComponent } from '../tab1/component/popover/popover.component';
import { Storage } from '@ionic/storage';
import { GetAppPortalService } from '../../services/get-app-portal.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {


   flag = 'home';
  change(event) {
    console.log('event.detail.tab:',event.detail.tab)
      this.flag=event.detail.tab;
  }
  private cbgcolor: any;
  public offlineFlag: boolean = false;
  public portalInfo: any;

  constructor(
    public popoverController: PopoverController,
    private storage: Storage,
    public geapp: GetAppPortalService,
    private router:Router

  ) {
    this.gotoDefaultHome();
    if (localStorage.getItem("bgcolor")) {
      console.log('localStorage-->bgcolor:', localStorage.getItem('bgcolor'));
      this.cbgcolor = `--color:${localStorage.getItem('bgcolor')};--color-selected:#0ec254`;
    }
    this.offlineFlag = localStorage.getItem('offlineFlag')?(localStorage.getItem('offlineFlag')=="false"?false:true):false;
    this.storage.get("loginDetails").then(data => {
      this.geapp.getPortalInfo(data).pipe(first())
            .subscribe(data => {
              if (data.data.indexOf('DOCTYPE') == -1) {
                data = JSON.parse(data.data);
                if(data.returnResponse == "offline"){
                  this.storage.get("offlinePortalInfo").then(d=>{
                    if(d) this.portalInfo = d;
                  
                  })
                }else{
                  this.portalInfo = data;
                }
                
               
              } else {
                this.router.navigate(['authemail'])
              }
            })
          })
  }
  async presentPopoverPortal(ev: any) {
    //this.portalInfo.userallportal = ['GMP Checklist'];
    const userallportal: any = this.portalInfo.userallportal;
    if(userallportal.length == 1){
      if(this.flag != 'tab1'){
        this.router.navigate(['tabs/tab1'], {queryParams: {key:'data',title:userallportal[0]}});
      }
    }else{
      const popover = await this.popoverController.create({
        component: PopoverComponent,
        event: ev,
        cssClass:"my-custom-class",
        componentProps: { type: "portal", portal: this.portalInfo },
        translucent: true
      });
      
      return await popover.present();
    }
    
  }
  async presentPopover(ev: any) {
    let selectPortalIndex: number = 0;
    if(this.portalInfo){
      //selectPortalIndex = this.portalInfo.items.findIndex(item => item.Title == this.portalTile)
    }
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      cssClass:"my-custom-class-set",
      componentProps: { type: "setup", portal: this.portalInfo,selectPortalIndex },
      translucent: true
    });
    return await popover.present();
  }
  gotoDefaultHome(){
    this.storage.get("portal").then(d=>{
      if(d){
        if(d=="To-Do"){
          this.router.navigate(['tabs/tab3']);
        }else{
          this.router.navigate(['tabs/tab1'], {queryParams: {key:'data',title:d}});
        }
      }
    })
  }
  getPortalLink(title){
    this.router.navigate(['tabs/tab1'], {queryParams: {key:'data',title:title}});
  }

}
