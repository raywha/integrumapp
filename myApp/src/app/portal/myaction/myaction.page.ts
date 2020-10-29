import { Component, OnInit } from '@angular/core';
import { ElementRef} from '@angular/core';
import { ModalController, AlertController, NavController,ActionSheetController ,Platform} from '@ionic/angular';
import { first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { CreateFromService } from '../../services/create-from/create-from.service';
import { ActivatedRoute } from '@angular/router';
import { GetAppPortalService } from '../../services/get-app-portal.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from "../../common/popover/popover.component";
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Router } from '@angular/router';
import { commonCtrl } from "../../common/common";
import { GetallformsService } from "../../services/getallforms.service";
import * as moment from 'moment';
@Component({
  selector: 'app-myaction',
  templateUrl: './myaction.page.html',
  styleUrls: ['./myaction.page.scss'],
  providers: [commonCtrl]
})
export class MyactionPage implements OnInit {
  public attLists: any = [];
  public unid:string = "";
  public type:string = "open";
  public cbgcolor:any;
  public title:String = "";
  public list:any=[];
  public AuditTrail:any;
  public isShowBtn:boolean=false;
  public showTrail: boolean = false;
  public optionData:any;
  public actPriority:string='';
  public headBtn: any = [];
  public actionList:any=[];
  public cameraTips:string = 'Tap image to see more options';
  public btnBox: any = {
    "result": [
      { "btnType": "btnSave", "btnLabel": "Save" },
      { "btnType": "btnClose", "btnLabel": "Close" }
    ]
  }
  public readAction:any;
  public placeholder:any={
    date:"",
    text:"",
    select:"",
    textarea:""
  };
  public pid:any;
  public pJson:any = {};
  public mJson:any = {};
  constructor(
    public getActionSerice: CreateFromService, 
    private storage:Storage,
    public translate :TranslateService,
    public activeRoute: ActivatedRoute,
    public geapp: GetAppPortalService,
    public popoverController: PopoverController,
    public router: Router,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public commonCtrl: commonCtrl,
    public getforms: GetallformsService,
    public nav:NavController
  ) { 
    if(localStorage.getItem("bgcolor")){
      this.cbgcolor = localStorage.getItem('bgcolor');
    }
    this.translate.get("readAction").subscribe(d=>{
      this.readAction = d;
      console.log("-----label:",this.readAction);
    })
    this.activeRoute.queryParams.subscribe(res => {
      this.unid = res.unid?res.unid:""; 
      this.pid = res.pid?res.pid:"";
      this.type = res.type;
      if(this.type=='open'||this.unid=="") {
        this.commonCtrl.show();
        this.getActDocData(this.unid?this.unid:"");
      }
      if(this.unid) this.btnBox["result"].push({ "btnType": "btnGoMain", "btnLabel": "Go to main form" });
      if(this.actionList.WFStatus) this.actionList.WFStatus = this.actionList.WFStatus=="Pending Management Representative Review"?"Pending MR Review":this.actionList.WFStatus;     
      if(this.actionList.DueDate && this.type=="edit") this.actionList.DueDate = moment(`${this.actionList.DueDate}`,'DD/MM/YYYY').format('YYYY-MM-DD')      
      if(this.type=="edit"&&this.unid!=""){
        if(this.mJson.edit) this.btnBox.result = this.mJson.edit;
      }
    })
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
    const cusstyle:string = `--background:${this.cbgcolor}`;
    document.getElementById("auditTrail").setAttribute("style",cusstyle);
    
  }
  getActDocData(unid){
    this.storage.get("loginDetails").then(data => {
      this.geapp.getActDocData(data,unid).pipe(first())
        .subscribe(data => {
          data = JSON.parse(data.data);
          console.log("------actdddddd0000:",data);
          this.actionList = data.actData;
          this.placeholder = data.placeholder;  
          this.pJson = data.pJson;
          this.mJson = data.mJson;
          if(this.mJson.open) this.btnBox.result = this.mJson.open;
          if(!this.actionList.EmployeeAssigned && !unid){
            this.actionList.EmployeeAssigned = localStorage.getItem("user");
          }
          if(this.actionList.WFStatus) this.actionList.WFStatus = this.actionList.WFStatus=="Pending Management Representative Review"?"Pending MR Review":this.actionList.WFStatus;
          this.commonCtrl.hide();
        })
    })
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { type: "action", data: this.btnBox},
      translucent: true,
      cssClass: "custom-popover",
      mode: "md"
    });
    popover.present();
    const { data } = await popover.onDidDismiss();
    this.getBtnLink(data)
  }
  getBtnLink(btn){
    let actiontype = "";
    switch (btn) {
      case "btnEdit":
        actiontype = "edit";
        this.router.navigate(["/myaction"], { queryParams: { unid: this.unid, type: actiontype } });
        break;
      case "btnSave":
        actiontype = "save";
        let para = {
          "unid":this.unid,
          "actData":this.actionList,
          "formaction":actiontype,
          "pid":this.pid?this.pid:""
        }
        console.log("-----para:",para);
        this.actSave(para);
        
        break;
      case "btnClose":
        this.router.navigate(["/tabs/tab3"]);
        break;
      case "btnGoMain":
          if(this.unid==""){
            this.router.navigate(["/new-form"]);
          }else{
            this.router.navigate(["/new-form"],{queryParams:{ unid: this.pJson.unid,vid:this.pJson.vid,aid:this.pJson.aid,title:this.pJson.title,stat:this.pJson.stat, type: 'open',cururl:"",act:"yes" } });
          }
          break;
      default:
        actiontype = "open";
        break;
    }
  }
  goback(){
    this.router.navigate(['tabs/tab3']);
  }
  actSave(para) {
    this.commonCtrl.processShow('Processing...');
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(logindata => {
        this.getforms.actionSave(logindata, para).pipe(first()).subscribe(data => {
          console.log('this.getforms.actionsave:', data)
          data = JSON.parse(data.data);
          this.commonCtrl.processHide();
          //console.log('this.getforms.submit:', JSON.parse(data.data));
          this.goback();
        })
      })
    })
  }
  async  takePicture(field,att) {
    const actionSheetAttachment = await this.actionSheetCtrl.create({
      header: 'Add a Photo',
      buttons: [
        {
          text: 'Take a Photo',
          //role: 'destructive',
          handler: () => {
            this.platform.ready().then((readySource) => {
              this.addLatlonToImage(field);
            });
          }
        },
        {
          text: 'Select a Photo',
          handler: () => {
            this.platform.ready().then((readySource) => {
              this.selecPicture(field);
            });
          }
        },
        {
          text: 'Remove a Photo',
          handler: () => {
            this.attLists= field.filter(function(obj){
              return obj!=att;
            })
            field= this.attLists;
            this.actionList.Attachment = field;
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            //
          }
        }
      ]
    });

    await actionSheetAttachment.present();

  };
  
  async addLatlonToImage(field) {
    // console.log("------------in addLatlonToImage------");
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    const imgsrc:string = `data:image/${image.format};base64,${image.base64String}`;
    //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(imgsrc);
    //this.photo = `data:image/${image.format};base64,${image.base64String}`;
    this.attLists=[];
    this.attLists.push({
      type:'image',
      value:imgsrc
    })
    if(field){
      field = field.concat( this.attLists);
    } else{
      field = this.attLists;
    }
    this.actionList.Attachment = field;
  };
  async selecPicture(field) {
    // console.log("------------in select picture------");
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    const imgsrc:string = `data:image/${image.format};base64,${image.base64String}`;
    //this.photo = `data:image/${image.format};base64,${image.base64String}`;
    this.attLists=[];
    this.attLists.push({
      type:'image',
      value:imgsrc
    })
    if(field){
      field = field.concat(this.attLists);
    } else{
      field = this.attLists;
    }
    this.actionList.Attachment = field;
    
  }
}