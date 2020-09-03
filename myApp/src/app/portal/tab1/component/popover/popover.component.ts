import { Component, OnInit} from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  public setting: any = [];
  public type: string;
  public portalList: any = [];
  public selectPortalIndex: number = 0;
  constructor(public nav: NavController, public Popover: PopoverController, public translate: TranslateService,
    public params: NavParams,
    public router:Router
  ) {
    this.translate.get('setting').subscribe(res => {
      this.setting = res;
    })
    this.type = this.params.get("type")
    if(this.type=='setup') this.selectPortalIndex = this.params.get('selectPortalIndex');
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
      this.nav.navigateBack('language',{queryParams:{selectPortalIndex:this.selectPortalIndex}})
    } else if (code == 3) {
      this.Popover.dismiss()
      // this.nav.navigateBack('add-action');

      this.nav.navigateBack('offline');
    }else if (code == 4) {
      this.Popover.dismiss()
      // this.nav.navigateBack('add-action');

      this.nav.navigateBack('lastrelease');
    }else{
      let paramsSet=this.params.get("portalTile")
      console.log(paramsSet)
     // let lan=this.translate.getDefaultLang();
      this.nav.navigateRoot('loginpass');
      localStorage.setItem('hasLogged', "false");
      this.Popover.dismiss()
    }
  }
  getPortalLink(data,title){
    this.router.navigate(['tabs/tab1'], {queryParams: {key:data,title:title}});
    this.Popover.dismiss()
  }
}

