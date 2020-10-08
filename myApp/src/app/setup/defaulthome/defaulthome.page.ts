import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-defaulthome',
  templateUrl: './defaulthome.page.html',
  styleUrls: ['./defaulthome.page.scss'],
})
export class DefaulthomePage implements OnInit {
  public portal:string="";
  public select:any={"text":"","value":""};
  public portalList:any;
  public public:any;
  public online:any;
  constructor(
    public translate: TranslateService,
    public activeRoute: ActivatedRoute,
    private storage: Storage,
  ) { 
    this.translate.get('public').subscribe(d => {
      this.public = d;
    })
    this.translate.get('online').subscribe(res => {
      this.online = res;
    })
    this.activeRoute.queryParams.subscribe(res => {
      this.portalList = res.portalList;
      if(this.portalList.length==1) {
        this.select.value = 'Portal Page';
        this.portal = this.portalList[0]['Title'];
        this.storage.set("portal",this.portal);
      }
      this.storage.get("portal").then(r=>{
        this.portal = r;
        if(this.portal){
          if(this.portal!="To-Do"){
            this.select.value = "Portal Page";
          }else{
            this.select.value = "To-Do Page"
          }
        }
      })
    });
  }

  ngOnInit() {
  }

  radioCheck(item){
    this.portal = item;
    this.storage.set("portal",item);  
  }
  changeSelect(page){
    if(page=="To-Do Page"){
      this.portal = "To-Do";
      this.storage.set("portal","To-Do");
    }
    if(page=="Portal Page"){
      if(this.portalList.length==1) {
        this.select.value = 'Portal Page';
        this.portal = this.portalList[0]['Title'];
        this.storage.set("portal",this.portal);
      }
    }
  }

}
