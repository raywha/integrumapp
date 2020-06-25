import { Component, OnInit, QueryList } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, AlertController, NavController,ActionSheetController ,Platform} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { GetallformsService } from "../../services/getallforms.service";
import { parseLazyRoute } from '@angular/compiler/src/aot/lazy_routes';
import { first } from 'rxjs/operators';
import { commonCtrl } from "../../common/common";
import { PopoverComponent } from "../../common/popover/popover.component"
import { SecurityComponent } from "../../common/security/security.component"
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { WebView } from '@ionic-native/ionic-webview/ngx';
import * as moment from 'moment';
import {OpenModalComponent} from "../../common/open-modal/open-modal.component";
import { RiskmatrixComponent } from "../../common/riskmatrix/riskmatrix.component";

import { ElementRef,ViewChildren} from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SignaturepadPopover } from '../signaturepad-popover/signaturepad-popover';
@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.page.html',
  styleUrls: ['./new-form.page.scss'],
  providers: [commonCtrl, Diagnostic]
})
export class NewFormPage implements OnInit {
  @ViewChildren("testdom") testdom: QueryList<ElementRef>;
  public formType;
  public templates: any;
  public title: string;
  public formID: string;
  public loadSecs: any = [];
  public fields: any = [];
  //For lat, lon field
  public attachedImages = [];
  public resvalue: any;
  public selecttemplat: any;
  public showGuidance: any = false;
  public sections: any = [];
  public sectionsold: any = [];
  public num: number;
  public list: any = [
    { "show": false }
  ];
  public isShowBtn: boolean = false;
  public btnBox: any = {
    "result": [
      { "btnType": "btnEdit", "btnLabel": "Edit" },
      { "btnType": "btnClose", "btnLabel": "Close" }
    ]
  };
  public para = {
    "unid": "",
    'isedit': ''
  }
  public formdata: any;
  public type: string;
  public sysfields: any = []
  public mandafields: any;
  public managerName: string;
  public psninfo: object;
  public severityvalue: string;
  public templatid: string;

  public ous: any = [];
  public ou1select: any = [];
  public ou2select: any = [];
  public ou3select: any = [];
  public ou4select: any = [];
  public ou5select: any = [];
  public paraforsubmit: any;
  public today = new Date().toISOString();
  public initiator: any = '';
  public initiatorOU: any = '';

  public ulrs = {
    "url": "",
    "stat": "",
    "title": "",
    "aid": "",
    "unid": ""
  }
  //lookup select --start 20200106
  public lookupOptins2: any = [];
  public lookupOptins3: any = [];

  //lookup select --end

  //subfield select --start 20200106
  public subfields: any = [];
  //subfield select --end
  public lasturl: string
  public portaltitle: string
  public radio = {
    value: null
  }
  public subformflag: string;
  public mainunid: string;
  public quesSecId: any = [];
  // riskmatrix
  public riskname: string;
  public riskmatrixvalue: any;
  public curDate:string = '';
  public maxYear:string = "2040";
  public attLists: any = [];
  public secbgcolor = "favorite";
  public cbgcolor = "#b81321";
  public txtfontcolor = "favorite";
  public skipMandatory:string = "0";
  public mandatoryWhenApprove: string = "0";
  //photo: SafeResourceUrl;
  public cameraTips:string = 'Tap image to see more options';
  public inheritMap:any;
  public atitle;
  public mr2Type;
  public mr2Val;
  public mr2Label:string = 'Select Final Reviewer';
  public reassignLabel: string = 'Select Person';
  public formmr;
  constructor(
    private storage: Storage,
    public modal: ModalController,
    public activeRoute: ActivatedRoute,
    public popoverController: PopoverController,
    public getforms: GetallformsService,
    public commonCtrl: commonCtrl,
    public router: Router,
    public alertController: AlertController,
    public nav: NavController,
    private el:ElementRef,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private diagnostic: Diagnostic,
    private camera: Camera,
    private geolocation: Geolocation,
    private sanitizer: DomSanitizer
  ) {
    if(localStorage.getItem("bgcolor")){
      console.log('localStorage-->bgcolor:',localStorage.getItem('bgcolor'))
      this.cbgcolor = localStorage.getItem('bgcolor');
    }
    let strnow = new Date();
    this.curDate = `${strnow.getFullYear()}-${(strnow.getMonth() + 1).toString().padStart(2, '0')}-${strnow.getDate().toString().padStart(2, '0')}`;
    
    this.storage.get('ous').then(data => {
      this.ous = data
    })

    this.storage.get('loginDetails').then(data => {
      console.log('logindetails:',this.cbgcolor)
      //if(data.code=="integrum001") this.cbgcolor = "#3880ff";this.secbgcolor = "action";this.txtfontcolor="primary";
      console.log('--logindetails:',this.cbgcolor)
      this.initiator = data.username!=''?data.username:localStorage.getItem('user');
      this.initiatorOU = data.OUCategory!=''?data.OUCategory:localStorage.getItem('OUCategory');
    })
    this.activeRoute.queryParams.subscribe(res => {
      console.log(res);
      console.log("进")
      this.ulrs.url = this.router.url
    this.ulrs.unid = this.getQueryVariable(this.ulrs.url, "unid")
    this.ulrs.aid = decodeURIComponent(this.getQueryVariable(this.ulrs.url, "aid"))
    this.ulrs.title = decodeURIComponent(this.getQueryVariable(this.ulrs.url, "title"))
    this.ulrs.stat = decodeURIComponent(this.getQueryVariable(this.ulrs.url, "stat"))

    this.riskname = this.getQueryVariable(this.ulrs.url, "riskName")
    if (this.riskname) {
      this.riskmatrixvalue = JSON.parse(decodeURIComponent(this.getQueryVariable(this.ulrs.url, "value")));
    }
      this.sections = []
      this.sectionsold = []
      this.portaltitle = res.temptitle
      this.subformflag = res.subform
      this.atitle = res.aTitle;
      this.mainunid = res.mainunid
      if (res.unid) {
        this.lasturl = res.cururl
        this.fields = [];
        this.formID = res.unid
        console.log("旧文档")
        this.type = res.type
        if (res.stat && res.stat!='false') {
          this.title = res.title + " (" + res.stat + ")"
        } else {
          this.title = res.title
        }
        
        this.list = [
          { "show": false }
        ];

        this.commonCtrl.show()
        this.getFormData(res.unid, res.type).then((data: any) => {
          // console.log(formdata)
          //this.storage.get("allforms").then(data => {
          // console.log(JSON.parse(data))
          //this.templates = JSON.parse(data).templates
          this.templates = data.templates
          //  console.log(this.templates)
          // alert(fileName);
          //this.selecttemplat = this.getTemplatByViewId(this.templates, res.aid)
          this.selecttemplat = this.templates[0];

          this.mandatoryWhenApprove = this.selecttemplat.mandatoryWhenApprove?this.selecttemplat.mandatoryWhenApprove:"0";
          this.skipMandatory = this.selecttemplat.skipMandatory?this.selecttemplat.skipMandatory:"0";
          let selectSecId: any = this.selecttemplat.sectionids ? this.selecttemplat.sectionids : [];
          selectSecId = ['FormMr'].concat(selectSecId);
          if (!this.selecttemplat) {
            console.log('Not find selecttemplat!');
            return false;
          }
          if(this.selecttemplat.secondFormMR && this.selecttemplat.secondFormMR.mrType){
            this.mr2Type = this.selecttemplat.secondFormMR.mrType;
            if(this.selecttemplat.secondFormMR.value) this.mr2Val  = this.selecttemplat.secondFormMR.value;
            if(this.selecttemplat.secondFormMR.label) this.mr2Label = this.selecttemplat.secondFormMR.label;
          }
          //if (this.type == "edit") {
          this.btnBox = this.selecttemplat.menubaritem
          //}
          if(this.btnBox.result){
            this.btnBox.result.forEach((val,index,arr) => {
              if(val.btnType && val.btnType=='btnEmailLink') arr.splice(index,1);
            });
            this.btnBox.result.forEach((val,index,arr) => {
              if (val.btnType && val.btnType=='btnPdf') arr.splice(index,1);
            });
          }
          

          this.selecttemplat.template.secs[0].fields.forEach(data => {

            if (data.xtype == "date") {
              //data.value = new Date()

              let element = data.value;
              if (element != '') {
                //let tempdate = new Date(element.replace("ZE8", ""))
                //this.draftime = tempdate.getFullYear() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getDate()
                //data.value  = tempdate.getDate() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getFullYear()
              }

            } else {
              //data.value = formdata[data.name]
            }
          })
          this.sysfields = this.selecttemplat.template.secs[0].fields
          this.mandafields = this.selecttemplat.template.mandaFields
          this.templatid = this.selecttemplat.templateId
          let quesFields: any = this.selecttemplat.template.quesFields;
          for (let i = 0; i < quesFields.length; i++) {
            const element = quesFields[i];
            let answerWhen = element.answerWhen;
            for (let key in answerWhen) {
              this.quesSecId = this.quesSecId.concat(answerWhen[key]);
            }
          }
          for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
            if (this.selecttemplat.template.secs[i].fields) {
              this.selecttemplat.template.secs[i].fields.forEach(data => {

                //data.value = formdata[data.name]
                if (data.name == "GMP_SEV_GMP_SH") {
                  this.severityvalue = data.value
                }
                
                if (data.xtype == "radio" || data.xtype == "select") {
                  if(data.xtype == "radio") data.options = data.options.filter(function (obj) { return obj.value != "" })
                  //data.options = data.options.filter(function (obj) { return obj.value != "" })
                  if (data.xtype == "select") {
                    let secId = this.selecttemplat.template.secs[i].secId;
                    if (this.selecttemplat.template.subListFields.length > 0) {
                      let fieldname = data.name;
                      let fieldId = fieldname.split(secId + '_')[1];
                      let v = this.selecttemplat.template.subListFields.find(e => e.parentSecId == secId &&
                        e.options && e.options.subfieldlist && e.options.subfieldlist.pfieldid && e.options.subfieldlist.pfieldid == fieldId)
                      if (v) {
                        data.hasSubfield = true;
                        data.fieldId = fieldId;
                        this.getSublistOption(data, secId,'open');
                      }

                    }
                    if (data.lookup && data.lookup.view) {
                      this.getSublistOption(data, secId,'open');
                    }
                  }
                } else if (data.xtype == 'multiou' || data.xtype == 'singleou') {
                  let obj: any = this.getOuLevelAndGroupId(data.name, this.selecttemplat.template.secs[i].secId);
                  let level: number = obj.level;
                  let ouGroupId: string = obj.ouGroupId;

                  if (data.value) {
                    // let iou:any = data.value.split('/');
                    // let tmp:any = '';
                    // for(let m=0;m<level;m++){
                    //   if(tmp==''){
                    //     if(iou[m]) tmp=iou[m];
                    //   }else{
                    //     if(iou[m]) tmp+="/"+iou[m];
                    //   }
                    // }
                    this.getOUSublistdetails(data.name, data.value, this.selecttemplat.template.secs[i].secId);
                    //data.value = tmp;
                  }

                } else if (data.xtype == 'riskmatrix') {
                  if (this.riskname) {
                    if (this.riskname == data.name) {
                      data.value = this.riskmatrixvalue;
                    }
                  } else {
                    if (data.value && data.value.ResultColor) {
                      let ResultColor: string = data.value.ResultColor;
                      if (ResultColor.indexOf('.jpg') != -1) {
                        let corlor: string = ResultColor.split('.jpg')[0];
                        if (corlor.indexOf('riskrank_') != -1) {
                          data.value['ResultColor'] = corlor.split('riskrank_')[1];
                        }
                      }
                    }
                  }
                }else if(data.xtype == 'checkbox'){
                  if(data.value){
                    let cehckvalues=data.value.split(",")
                    data.options.forEach(option =>{
                       let flag=cehckvalues.some(v =>{
                         return v==option.value
                       })
                       if(flag){
                         option.ischeck=true
                       }else{
                        option.ischeck=false
                       }
                    })
                  }
                
                 
              }else if(data.xtype == 'questionnaire'){
                let v = data.options[0];
                if(v && v.value){
                  if(v.value!='') data.options.unshift({value:'',text:''});
                }
              }else if(data.xtype == 'date'){
                if(this.type != 'edit'){
                  if(data.value && data.value!='') data.value = moment(`${data.value}`,'YYYY-MM-DD').format('DD/MM/YYYY');
                }
              }else if(data.xtype == 'time'){
                //if(this.type != 'edit'){
                  if(data.value && data.value!='') data.value = moment(`${data.value}`,'YYYY-MM-DD hh:mm:ss').format('HH:mm:ss');
                //}
              }else if(data.xtype == 'signature'){
                data.value = this.sanitizer.bypassSecurityTrustResourceUrl( data.value );
              }
                this.fields.push(data) //
                // this.selectScore(data,data.value,this.selecttemplat.template.secs[i].title)
              })
            }else if(this.selecttemplat.template.secs[i].secId == "AuditTrail"){
              if(this.selecttemplat.template.secs[i].secInfoContent && this.selecttemplat.template.secs[i].secInfoContent!='') selectSecId.push('AuditTrail');
            }
            // console .log(this.selecttemplat.template.secs[i])
            // console.log(this.selecttemplat.template.secs[i].secId)
            if (selectSecId.indexOf(this.selecttemplat.template.secs[i].secId) != -1) this.sections.push(this.selecttemplat.template.secs[i])
            //if(this.quesSecId.indexOf(this.selecttemplat.template.secs[i].secId)==-1) this.sections.push(this.selecttemplat.template.secs[i])
            this.sectionsold.push(this.selecttemplat.template.secs[i])

            this.list.push({ "show": false })
            this.commonCtrl.hide()
          }
          this.initHasSubfield('open');
          // console.log(this.list)
          let flag = this.sections.some(function (obj, index) {
            return obj.title == "Severity"
          })
          if (flag) {
            this.change({ "label": "Severity", "value": this.severityvalue })
          }
          //})
        })
      } else {
        if(res.subform && res.subform == 'true'){
          this.lasturl = res.cururl;
        }else{
          this.lasturl = "/tabs/tab1?title=" + this.portaltitle
        }
        this.fields = [];
        this.type = "edit"
        if(res.subform && res.mainunid && res.mainunid!=""){
          this.inheritValue({"mainunid":res.mainunid}).then((result: any) => {
            this.inheritMap = result;
            console.log("-------ssss:",this.inheritMap);
            this.getAllForms(res);
          })    
        }else{
          this.getAllForms(res);     
        }              
      }
    })

  }
  getAllForms(res){
    this.storage.get("allforms").then(data => {
      data = JSON.parse(data)
      if(data==null){
        console.log(' allforms is loading!');
        return false;
      }
      this.templates = data.templates
      //this.templates = JSON.parse(data).templates
      this.selecttemplat = this.getTemplatByViewId(this.templates, res.aid)
      if (!this.selecttemplat) {
        console.log(res.aid,' is not find!');
        return false;
      }
      this.mandatoryWhenApprove = this.selecttemplat.mandatoryWhenApprove?this.selecttemplat.mandatoryWhenApprove:"0";
      this.skipMandatory = this.selecttemplat.skipMandatory?this.selecttemplat.skipMandatory:"0";
      this.btnBox = this.selecttemplat.menubaritem
      this.title = this.selecttemplat.template.templateTitle
      this.sysfields = this.selecttemplat.template.secs[0].fields
      this.mandafields = this.selecttemplat.template.mandaFields
      this.templatid = this.selecttemplat.template.templateId
      //get questionnaire sections
      let quesFields: any = this.selecttemplat.template.quesFields;
      for (let i = 0; i < quesFields.length; i++) {
        const element = quesFields[i];
        let answerWhen = element.answerWhen;
        for (let key in answerWhen) {
          this.quesSecId = this.quesSecId.concat(answerWhen[key]);
        }
      }

      for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
        this.selecttemplat.template.secs[i].fields.forEach(data => {
          
          if (data.xtype == "radio" || data.xtype == "select") {
            if(data.xtype == "radio") data.options = data.options.filter(function (obj) { return obj.value != "" })
            //data.options = data.options.filter(function (obj) { return obj.value != "" })
            if (data.xtype == "select") {
              if (this.selecttemplat.template.subListFields.length > 0) {
                let secId = this.selecttemplat.template.secs[i].secId;
                let fieldname = data.name;
                let fieldId = fieldname.split(secId + '_')[1];
                let v = this.selecttemplat.template.subListFields.find(e => e.parentSecId == secId &&
                  e.options && e.options.subfieldlist && e.options.subfieldlist.pfieldid && e.options.subfieldlist.pfieldid == fieldId)
                if (v) {
                  data.hasSubfield = true;
                  data.fieldId = fieldId;
                }

              }
            }
          } else if (data.xtype == 'multiou' || data.xtype == 'singleou') {
            let obj: any = this.getOuLevelAndGroupId(data.name, this.selecttemplat.template.secs[i].secId);
            let level: number = obj.level;
            let ouGroupId: string = obj.ouGroupId;
            if (this.initiatorOU) {
              let iou: any = this.initiatorOU.split('\\');
              let tmp: any = '';
              for (let m = 0; m < level; m++) {
                if (tmp == '') {
                  if (iou[m]) tmp = iou[m];
                } else {
                  if (iou[m]) tmp += "/" + iou[m];
                }
              }
              this.getOUSublistdetails(data.name, tmp, this.selecttemplat.template.secs[i].secId);
              data.value = tmp;
            }

          }else if(data.xtype == 'checkbox'){
            if(data.value){
              let cehckvalues=data.value.split(",")
              data.options.forEach(option =>{
                 let flag=cehckvalues.some(v =>{
                   return v==option.value
                 })
                 if(flag){
                   option.ischeck=true
                 }else{
                  option.ischeck=false
                 }
              })
            }
          
           
        }else if(data.xtype == 'questionnaire'){
          let v = data.options[0];
          if(v && v.value){
            if(v.value!='') data.options.unshift({value:'',text:''});
          }
        }
        if(res.subform && this.inheritMap[data.name]){
          console.log("---inheritval--------:",this.inheritMap[data.name]);
          if (data.xtype == 'multiou' || data.xtype == 'singleou') {
            this.getOUSublistdetails(data.name, this.inheritMap[data.name], this.selecttemplat.template.secs[i].secId);
          }
          data.value = this.inheritMap[data.name];
        }
          this.loadSecs.push(data);
          this.fields.push(data) //
          //this.selectScore(data,data.value,this.selecttemplat.template.secs[i].title)
        })
        // console .log(this.selecttemplat.template.secs[i])
        if (this.quesSecId.indexOf(this.selecttemplat.template.secs[i].secId) == -1) this.sections.push(this.selecttemplat.template.secs[i])
        this.sectionsold.push(this.selecttemplat.template.secs[i])
        this.list.push({ "show": false })
      }
      this.initHasSubfield('change');
      let flag = this.sections.some(function (obj, index) {
        //console.log(obj.title)
        return obj.title == "Severity"
      })
      if (flag) {
        this.change({ "label": "Severity" })
      }

    })
  }
  getTemplatByViewId(data, vid) {
    let res;
    data.forEach(element => {
      if (element.template.template_id == vid) {
        res = element
      }
    });
    return res;
  }

  ngOnInit() {

    //console.log(this.sections[0])

  }


  ionViewDidLoad() {

  };


  isShowGuidance(sectionid, index) {
    // console.log(sectionid)
    //console.log(index)
    // console.log(this.list)
    this.showGuidance = !this.showGuidance;
    this.num = index;
    this.list[index].show = !this.list[index].show;
  }

  getSwitchBtn(item) {

    this.isShowBtn = false;
  }
  getBtnPopover() {
    //打开btn
    this.isShowBtn = true;
    // this.el.nativeElement.querySelector('.shade');  获取元素操作dom

  }
  closeZoom() {
    this.isShowBtn = false;
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { type: "action", data: this.btnBox, formdata: this.fields, unid: this.formID, tempid: this.templatid,txtfontcolor:this.txtfontcolor },
      translucent: true,
      cssClass: "custom-popover",
      mode: "md"
    });
    popover.present();
    const { data } = await popover.onDidDismiss();
    console.log(data)
    this.getBtnLink(data)
  }

  getBtnLink(btn) {
    // this.fields.forEach(data => {
    //   if(data.xtype == "date"&&data.value!=undefined){
    //    data.value =data.value.substring(0,data.value.indexOf("T"))
    //   }
    // })
    let actiontype = ""
    switch (btn) {
      case "btnEdit":
        actiontype = "edit"
        this.router.navigate(["/new-form"], { queryParams: { unid: this.ulrs.unid, aid: this.ulrs.aid, title: this.ulrs.title, stat: this.ulrs.stat, type: actiontype, refresh: new Date().getTime(), cururl: this.lasturl } });
        break;
      case "btnSave":
        actiontype = "edit"
        console.log("unid==" + this.formID)
        console.log(this.fields)
        if (this.subformflag) {
          this.paraforsubmit = {
            "tempid": this.templatid,
            "formAction": "save",
            "docId": "",
            "fields": this.fields,
            "subForm": "true",
            "mainFormId": this.mainunid
          }
        } else {
          if (this.formID) {
            this.paraforsubmit = {
              "tempid": this.templatid,
              "formAction": "save",
              "docId": this.formID,
              "fields": this.fields
            }
          } else {
            console.log("tempid==" + this.templatid)
            this.paraforsubmit = {
              "tempid": this.templatid,
              "formAction": "save",
              "docId": "",
              "fields": this.fields
            }
          }
        }

        console.log("保存了")
        if(this.mandatoryWhenApprove!="1" && this.skipMandatory=="0"){
          const {fieldError,msg} = this.checkMandatoryField();
          if (fieldError) {
            console.log("必填了")
            console.log(msg)
            this.presentAlert("The follow fields are mandatory:<br/>" + msg, "", ["OK"])
            return false;
          }
        }
        this.submit(this.paraforsubmit, actiontype)
        break;
      case "btnSubmit":
        console.log("unid==" + this.formID)
        console.log(this.fields)
        actiontype = "edit"
        if (this.subformflag) {
          this.paraforsubmit = {
            "tempid": this.templatid,
            "formAction": "submit",
            "docId": "",
            "fields": this.fields,
            "subForm": "true",
            "mainFormId": this.mainunid
          }
        } else {
          if (this.formID) {
            this.paraforsubmit = {
              "tempid": this.templatid,
              "formAction": "submit",
              "docId": this.formID,
              "fields": this.fields
            }
          } else {
            console.log("tempid==" + this.templatid)
            this.paraforsubmit = {
              "tempid": this.templatid,
              "formAction": "submit",
              "docId": "",
              "fields": this.fields
            }
          }
        }

        console.log("提交操作")
        if(this.mandatoryWhenApprove!="1"){
          const {fieldError,msg} = this.checkMandatoryField();
          if (fieldError) {
            console.log("必填了")
            console.log(msg)
            this.presentAlert("The follow fields are mandatory:<br/>" + msg, "", ["OK"])
            return false;
          }
        }
        

        this.submit(this.paraforsubmit, actiontype)

        break;
      case "btnNewSubForm":
        actiontype = "edit"
        let aid: string = this.selecttemplat.template.subform.templates.join('**');

        //this.router.navigate(["/new-form"], { queryParams:{aTitle: this.title,aid,temptitle: this.portaltitle,subform:"true",mainunid:this.ulrs.unid,cururl: this.lasturl}});
        this.router.navigate(["/subformlist"], { queryParams: { aTitle: this.title, aid, temptitle: this.portaltitle, subform: "true", mainunid: this.ulrs.unid, cururl: this.lasturl, lasturl: this.router.url } });
        break;
      case "btnClose":
        actiontype = "open"
        if (this.subformflag) {
          actiontype = "edit"
          this.router.navigate(["/new-form"], { queryParams: { unid: this.mainunid, aid: this.ulrs.aid, title: this.atitle, stat: this.ulrs.stat, type: actiontype, refresh: new Date().getTime(), cururl: this.lasturl } });
        } else {
          this.router.navigateByUrl(this.lasturl)
        }

        break;
        case "btnDelete":
          console.log("操作删除")
          this.presentModal('delete');
          break;
          case 'btnSendForRv':
        if(this.mr2Type){
          console.log('mr2type:',this.mr2Type)
          if(this.mr2Type=='template'){
            //this.submitToMr2(this.formID,data.result);
            console.log('this.mr2Val:',this.mr2Val);
            if(this.mr2Val && this.mr2Val.length>0){
              let options="";
              for(let i=0;i<this.mr2Val.length;i++){
                options+='<ion-item><ion-label>'+this.mr2Val[i]+'</ion-label><ion-radio slot="end" value='+this.mr2Val[i]+'></ion-radio></ion-item>';
              }
              this.presentAlert( '<ion-radio-group>'+options+'</ion-radio-group>',"",[
                {text:'Cancel',role:'Cancel',handler:()=>{console.log("----cancel----");}},
                {
                  text:'OK',handler:()=>{
                    let dom = document.querySelector(".radio-checked");
                    if(dom){
                      let label = dom.parentNode.children[0];
                      let val = label.textContent;
                      console.log("----------val----:",val);
                      this.submitToMr2(this.formID,val);
                    }                  
                  }
                }
              ]);
            }else{
              this.getPersons('', 'single', this.mr2Label, 'submitToMr2');
            }
          }else if(this.mr2Type=='directmanager'){
            console.log('mr2value:',this.mr2Val);
            if(this.mr2Val && this.mr2Val!='' && this.mr2Val!=[]){
              this.submitToMr2(this.formID,this.mr2Val);
            }else{
              this.getPersons('', 'single', this.mr2Label, 'submitToMr2');
            }
          }else{
            this.getPersons('', 'single', this.mr2Label, 'submitToMr2');
          }
        }else{
          this.getPersons('', 'single', this.mr2Label, 'submitToMr2');
        }
        
        break;
        case 'btnReAssign':
        this.getPersons('', 'single', this.reassignLabel, 'reAssign')
        break;
      default:
        actiontype = "open"
        // this.router.navigateByUrl(this.lasturl)
        break;
    }
    console.log("操作了吗")
    // this.router.navigateByUrl(this.lasturl)
    //
    //this.Popover.dismiss(btn)


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
  getQueryVariable(url, variable) {
    let query = url.split("?")[1]
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  }
  checkMandatoryField():any{
    let sectionsIds:any = [];
    for (let i = 0; i < this.sections.length; i++) {
      const element = this.sections[i];
      if(element.secId) sectionsIds.push(element.secId);
    }
    console.log("check mandatory field!")
    let msg = "";
    let fieldError = false;
    for (let p = 0; p < this.selecttemplat.template.mandaFields.length; p++) {
      for (let d = 0; d < this.fields.length; d++) {
        if (this.selecttemplat.template.mandaFields[p].fieldId == this.fields[d].name) {
          if(this.fields[d].hide && this.fields[d].hide==true) continue;
          const fiedSecId = this.fields[d].secId;
          if(fiedSecId){
            if(!sectionsIds.includes(fiedSecId)) continue;
          }
          let type = this.selecttemplat.template.mandaFields[p].type;
          //let con=this.formType.template.mandaFields[p].con;
          if (type.includes("m")) {
            if ((this.fields[d].value == "") || (this.fields[d].value == undefined)) {
              msg += this.selecttemplat.template.mandaFields[p].label + ' <br/>';
              fieldError = true;
            }else if(type.includes("d")){
              if (this.fields[d].value < this.today) {
                msg += this.selecttemplat.template.mandaFields[p].label + ' date cannot be less than current date';
                fieldError = true;
              }
            }
          }
          else {
            if (type == "d") {
              if ((this.fields[d].value == "") || (this.fields[d].value == undefined)) {
                msg += this.selecttemplat.template.mandaFields[p].label + '<br/>';
                fieldError = true;
              }
              else {

                if (this.fields[d].value < this.today) {
                  msg += this.selecttemplat.template.mandaFields[p].label + ' date cannot be less than current date';
                  fieldError = true;
                }
              }
            }
          }
        }
      }
    }//End

    return {fieldError,msg};
  }
  submit(para, actiontype) {
    this.commonCtrl.processShow('Processing...');
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(logindata => {
        //this.getforms.getFormData(logindata, { "unid": "EBE27D0FEC6AEFF9482584D90020DCE6" }).pipe(first()).subscribe(data => {
        this.getforms.submit(logindata, para).pipe(first()).subscribe(data => {
          console.log('this.getforms.submit:', data)
          //data = JSON.parse(data.data);
          console.log('this.getforms.submit:', JSON.parse(data.data))
          this.commonCtrl.processHide();
          //this.router.navigate(["/new-form"], { queryParams: { unid:  this.ulrs.unid, aid: this.ulrs.aid, title: this.ulrs.title, stat: this.ulrs.stat, type: actiontype, refresh: new Date().getTime() } });
          if (this.subformflag) {
            this.router.navigate(["/new-form"], { queryParams: { unid: this.mainunid, aid: this.ulrs.aid, title: this.atitle, stat: this.ulrs.stat, type: actiontype, refresh: new Date().getTime(), cururl: this.lasturl } });
          } else {
            this.router.navigateByUrl(this.lasturl)
          }

        })
        //resolve(data)
        //})
      })
    })
  }

  getFormData(unid: any, isedit: any) {
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(data => {
        this.para.unid = unid
        this.para.isedit = isedit == 'edit' ? 'yes' : 'no';
        this.getforms.getFormData(data, this.para).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
          resolve(data)
        })
      })
    })
  }
  changeback0113(field: any) {
    console.log(field)
    if (field.label.trim() != "Severity") {
      return false;
    }
    let oldsections = this.sectionsold
    let filtersections = []
    filtersections = oldsections.filter(obj => {
      return obj.title.indexOf(field.value) != -1 && field.value != ""
    })
    var curindex
    oldsections.forEach((element, index) => {
      if (element.title.trim() === "Severity") {
        curindex = index
      }
    });
    this.sections = oldsections.slice(0, curindex + 1).concat(filtersections)
    this.sections.forEach(secelement => {
      secelement.fields.forEach(element => {
        this.selectScore(element, element.value, secelement.title)
      });
    });

  }
  change(field: any) {
    let quesFields: any = this.selecttemplat.template.quesFields;
    let v = quesFields.find(e => e.fieldId == field.name);
    if (v) {
      let quesFields: any = [];
      let answerWhen = v.answerWhen;
      for (let key in answerWhen) {
        quesFields = quesFields.concat(answerWhen[key]);
      }
      quesFields.forEach(element => {
        let index: number = this.sections.findIndex(e => e.secId == element);
        if (index != -1) this.sections.splice(index, 1);
      });
      if(field.value!=''){
        let disSecId: any = v.answerWhen[field.value];
        let newArr:any = [];
        disSecId.forEach(e=>{
          let index = this.sectionsold.findIndex(el=>el.secId==e);
          if(index) newArr.push({e,index});
        })
        newArr.sort((a,b)=>a.index-b.index);
        
        newArr.forEach(element => {
          let el = this.sectionsold.find(e => e.secId == element.e);
          if (el){
            let eindex = element.index;
            let sindex:number = this.getSectionIndex(eindex-1);
            const max:number = 30;
            let i:number = 0;
            while(sindex==-1){
              eindex--;
              i++;
              sindex = this.getSectionIndex(eindex-1);
              if(i==max) sindex = 1;
            }
            this.sections.splice(sindex,0,el);
            this.initHasSubfield('open');
          }
        });
      }
      

    }

    this.sections.forEach(secelement => {
      if(secelement.fields){
        secelement.fields.forEach(element => {
          this.selectScore(element, element.value, secelement.title)
        });
      }
      
    });


  }
  getSectionIndex(index:number):number{
    if(index<0) return 1;
    
    const fsection = this.sectionsold[index];
    if(fsection){
      const fsecId:string = fsection.secId;
      const elenum:number = this.sections.findIndex(e=>e.secId==fsecId);
      if(elenum==-1){
        //this.getSectionIndex(index-1);
        return -1;
      }else{
        return elenum+1;
      }
    }
    return 1;
  }
  //查找名称
  async getSecurity(fieldname, fieldvalue,stype:string,label) {
    const modal = await this.modal.create({
      showBackdrop: true,
      component: SecurityComponent,
      componentProps: {stype,fieldvalue,label,cbgcolor:this.cbgcolor }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
      if(this.selecttemplat.template.secs[i].fields){
        this.selecttemplat.template.secs[i].fields.forEach(item => {
          // console.log(fieldname)
          // console.log(item.name)
          if (item.name == fieldname) {
            // console.log(data)
            item.value = data.result;
          }
        })
      }
      

    }

    // console.log(this.selecttemplat.template.secs)

  }
  getOuList(fieldName: any, pSecId: any) {
    let obj: any = this.getOuLevelAndGroupId(fieldName, pSecId);
    let level: number = obj.level;
    let ouGroupId: string = obj.ouGroupId;
    //console.log('obj:',obj,'--level:',level,'--ouGroupId:',ouGroupId)
    var arr: any = [];
    var tmparr: any = [];
    if (level == 1) {
      //return JSON.parse(this.ous).ou1;
      if (this.ous) {
        tmparr = JSON.parse(this.ous).ou1;
        for (let i = 0; i < tmparr.length; i++) {
          arr.push({ text: tmparr[i], value: tmparr[i] });
        }
      }

    } else {
      let ouselect: any = this['ou' + (level - 1) + 'select'];

      if (ouselect) {
        let v: any = ouselect.find(e => e.ouGroupId == ouGroupId);
        if (v) return v['ou' + level + 'list'] ? v['ou' + level + 'list'] : [];
      }
    }
    return arr;
  }
  getOUSublistdetails(name: any, val: any, pSecId: any) {
    val = typeof (val) == 'string' ? [val] : val;
    let obj: any = this.getOuLevelAndGroupId(name, pSecId);
    let level: number = obj.level;
    let ouGroupId: string = obj.ouGroupId;
    let ou: any = {};
    ou.ouGroupId = ouGroupId;
    let arr: any = [];
    let ouLevelList = JSON.parse(this.ous)["ou" + (level + 1)];
    if(!ouLevelList) return;
    let tmparr: any = [];
    let tmparr1: any = [];
    let tmparr2: any = [];
    let text: any;
    let value: any;

    if(val.length==0){
      //ou5select
      for (let i = level; i < 6; i++) {
        if(this['ou'+i+'select']){
          let v = this['ou' + i + 'select'].find(e => e.ouGroupId == ouGroupId);
          if(v) v['ou' + (i + 1) + 'list'] = [];
        }
      }
      let v = this.sections.find(e=>e.secId == pSecId);
      if(v){
        if(v.fields){
          for (let i = 0; i < v.fields.length; i++) {
            let e = v.fields[i];
            if(e.xtype=='multiou' || e.xtype=='singleou'){
              if(e.name==name) continue;
              let o: any = this.getOuLevelAndGroupId(e.name, pSecId);
              if(o.ouGroupId == ouGroupId){
                
                if(o.level>level) e.value = '';
                
              } 
            }
          }
        }
      }
      return ;
    }

    for (let i = 0; i < val.length; i++) {
      if (val[i].indexOf('/') > -1) {
        tmparr2 = val[i].split('/');
      } else {
        tmparr2 = [val[i]];
      }
      let v = ouLevelList.find(e => {
        if (level == 1) return e['ou' + level] == tmparr2[0];
        if (level == 2) return e['ou' + level] == tmparr2[1] && e['ou' + (level - 1)] == tmparr2[0];
        if (level == 3) return e['ou' + level] == tmparr2[2] && e['ou' + (level - 1)] == tmparr2[1] && e['ou' + (level - 2)] == tmparr2[0];
        if (level == 4) return e['ou' + level] == tmparr2[3] && e['ou' + (level - 1)] == tmparr2[2] && e['ou' + (level - 2)] == tmparr2[1] && e['ou' + (level - 3)] == tmparr2[0];
        if (level == 5) return e['ou' + level] == tmparr2[4] && e['ou' + (level - 1)] == tmparr2[3] && e['ou' + (level - 2)] == tmparr2[2] && e['ou' + (level - 3)] == tmparr2[1] && e['ou' + (level - 4)] == tmparr2[0];
        return e;
      })

      tmparr1 = [];
      if (v) {
        tmparr = v['ou' + (level + 1)];
        for (let j = 0; j < tmparr.length; j++) {
          text = tmparr[j] + '(' + tmparr2[level - 1] + ')';
          if (level == 1) {
            value = tmparr2[0] + '/' + tmparr[j];
          } else if (level == 2) {
            value = tmparr2[0] + '/' + tmparr2[1] + '/' + tmparr[j];
          } else if (level == 3) {
            value = tmparr2[0] + '/' + tmparr2[1] + '/' + tmparr2[2] + '/' + tmparr[j];
          } else if (level == 4) {
            value = tmparr2[0] + '/' + tmparr2[1] + '/' + tmparr2[2] + '/' + tmparr2[3] + '/' + tmparr[j];
          } else if (level == 5) {
            value = tmparr2[0] + '/' + tmparr2[1] + '/' + tmparr2[2] + '/' + tmparr2[3] + '/' + tmparr2[4] + '/' + tmparr[j];
          } else {
            text = '';
            value = '';
          }

          tmparr1.push({ text, value })
        }
      }

      arr = arr.concat(tmparr1);
    }

    ou['ou' + (level + 1) + 'list'] = arr;
    let index: number = this['ou' + level + 'select'].findIndex(e => e.ouGroupId == ouGroupId);
    if (index == -1) {
      this['ou' + level + 'select'].push(ou);
    } else {
      this['ou' + level + 'select'].splice(index, 1, ou);
    }
    // for (let i = level+1; i < 6; i++) {
    //   if(this['ou'+i+'select']){
    //     let v = this['ou' + i + 'select'].find(e => e.ouGroupId == ouGroupId);
    //     if(v) v['ou' + (i + 1) + 'list'] = [];
    //   }
    // }
    let v = this.sections.find(e=>e.secId == pSecId);
    if(v){
      if(v.fields){
        for (let i = 0; i < v.fields.length; i++) {
          let e = v.fields[i];
          if(e.xtype=='multiou' || e.xtype=='singleou'){
            if(e.name==name) continue;
            let o: any = this.getOuLevelAndGroupId(e.name, pSecId);
            if(o.ouGroupId == ouGroupId){
             
              if(o.level>level){
                if(e.xtype=='singleou'){
                  e.value = '';
                  let tm:number = level+1;
                  if(this['ou'+tm+'select']){
                    let v = this['ou' + tm + 'select'].find(e => e.ouGroupId == ouGroupId);
                    if(v) v['ou' + (tm + 1) + 'list'] = [];
                  }
                }else{
                  let curlevel:number = o.level;
                  let selectOU:any = this['ou' + (curlevel-1) + 'select'];
                  if(selectOU){
                    let gou:any = selectOU.find(a => a.ouGroupId == ouGroupId);
                    if(gou){
                      let eleval:any = typeof (e.value) == 'string' ? [e.value] : e.value;
                      let list:any = gou['ou' + (curlevel) + 'list'];
                      let t = list.find(ele=>eleval.indexOf(ele.value)!=-1);
                      if(!t){
                        e.value='';
                        let tm:number = curlevel;
                        if(this['ou'+tm+'select']){
                          let v = this['ou' + tm + 'select'].find(e => e.ouGroupId == ouGroupId);
                          if(v) v['ou' + (tm + 1) + 'list'] = [];
                        }
                      }
                    }
                    
                  }
                  
                }
              }
              
            } 
          }
        }
      }
    }
  }
  getOuLevelAndGroupId(fieldName: any, pSecId: any): object {
    let level: number = 1
    let ouGroupId: string = ''
    for (var i = 1; i <= 10; i++) {
      if (this.selecttemplat.template['ou' + i + 'Fields']) {

        let v = this.selecttemplat.template['ou' + i + 'Fields'].find(item => item.parentSecId == pSecId && item.fieldId == fieldName)
        if (v) {
          level = i;
          ouGroupId = v.ouGroupId;
          break;
        }

      }
    }

    return { level, ouGroupId };
  }
  getSelectOption(field: any, secId: any) {

    if (field.lookup.view) {
      let column: any = field.lookup.column;
      if (column == "1") {
        return field.options;
      } else {
        if(column!=''){
          let v = this['lookupOptins' + column].find(e => {
            return e.secId == secId && e.view == field.lookup.view;
          });
          return v ? v.options : [];
        }
        
      }
      return field.options;
    }
    if (field.pFieldId != '') {
      let v = this.selecttemplat.template.subListFields.find(e => e.parentSecId == secId && e.fieldId == field.name);
      if (v) {
        let t = this.subfields.find(e => e.secId == secId && e.fieldId == field.name);

        if (t) return t.options;
      }
    }
    return field.options;
  }
  getSublistOption(field: any, secId: any,stype:string) {
    if (field.lookup.view) {
      let column: any = field.lookup.column;
      let view: any = field.lookup.view;
      let val: any = field.value;
      if(!val) {
        let newcolumn = parseInt(column) + 1;
        while(newcolumn<5){
          if(this['lookupOptins' + newcolumn]){
            let v = this['lookupOptins' + newcolumn].find(e => {
              return e.secId == secId && e.view == field.lookup.view;
            });
            if(v) v.options = [];
            newcolumn++;
          }else{
            newcolumn = 6;
          }
          
        }
      let v = this.sections.find(e=>e.secId == secId);
      if(v){
        if(v.fields){
          for (let i = 0; i < v.fields.length; i++) {
            let e = v.fields[i];
            if(e.lookup && e.lookup.view){
              
              if(e.lookup.view==view && parseInt(e.lookup.column)>=column){
                e.value = '';
                if(parseInt(e.lookup.column)>column){
                  
                  if(this['lookupOptins' + parseInt(e.lookup.column)]){
                      let t = this['lookupOptins' + parseInt(e.lookup.column)].find(e=>e.secId==secId && e.view == view);
                      if(t && t.options) t.options = [];
                  }
                }
              } 
            }
          }
        }
      }
        return
      }
      if (parseInt(column) > 1) {
        let v = this['lookupOptins' + column].find(e => {
          return e.secId == secId && e.view == view;
        });
        if (v && v.lastval) val = v.lastval + '@@' + val;

      }
      column = parseInt(column) + 1;
      let obj: any = {
        key: val,
        db: field.lookup.db ? field.lookup.db : '',
        view,
        column
      }
      this.getLookupOptions(obj).then((data: any) => {
        if (data.status == "success") {
          let options: any = [];
          options.push({ value: '', text: '' })
          for (let i = 0; i < data.data.length; i++) {
            let element = data.data[i];
            options.push({ value: element, text: element })
          }

          let tobj: object = {
            secId,
            view,
            lastval: val,
            options: options
          }
          if (this['lookupOptins' + column]) {
            let index: number = this['lookupOptins' + column].findIndex(e => e.secId == secId && e.view == view);
            if (index == -1) {
              this['lookupOptins' + column].push(tobj);
            } else {
              this['lookupOptins' + column].splice(index, 1, tobj);
            }
          }

        }
      });
      let v = this.sections.find(e=>e.secId == secId);
      if(v){
        if(v.fields){
          for (let i = 0; i < v.fields.length; i++) {
            let e = v.fields[i];
            if(e.lookup && e.lookup.view){
              
              if(e.lookup.view==view && parseInt(e.lookup.column)>=column){
                e.value = '';
                if(parseInt(e.lookup.column)>column){
                  
                  if(this['lookupOptins' + parseInt(e.lookup.column)]){
                      let t = this['lookupOptins' + parseInt(e.lookup.column)].find(e=>e.secId==secId && e.view == view);
                      if(t && t.options) t.options = [];
                  }
                }
              } 
            }
          }
        }
      }
    }
    if (field.hasSubfield) {
      let val = field.value;
      let fieldId = field.fieldId;
      let v = this.selecttemplat.template.subListFields.find(e => e.parentSecId == secId &&
        e.options && e.options.subfieldlist && e.options.subfieldlist.pfieldid &&
        fieldId && e.options.subfieldlist.pfieldid == fieldId)
      if (v) {
        let element = v.options.subfieldlist.list.find(e => e.value == val);
        if (element) {
          let options: any = [];
          for (let i = 0; i < element.list.length; i++) {
            let ele = element.list[i];
            options.push({ value: ele, text: ele })
          }
          let obj: object = {
            secId,
            fieldId: v.fieldId,
            options
          }
          let index: number = this.subfields.findIndex(e => e.secId == secId && e.fieldId == v.fieldId);
          if (index == -1) {
            this.subfields.push(obj);
          } else {
            this.subfields.splice(index, 1, obj);
          }

        }
      }
    }
    for (var i = 0; i < this.selecttemplat.template.hasSubFields.length; i++) {
      var sfield = this.selecttemplat.template.hasSubFields[i];
      //if(secId!=field.parentSecId) continue;
      var hasSubFieldEl = sfield.fieldId;
      if (hasSubFieldEl == field.name) {
        this.hasSubfieldChange(sfield, field.value,stype);
      }
    }
  }
  getLookupOptions(para: object) {
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(data => {
        this.getforms.getLoopupOptions(data, para).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
          resolve(data)
        })
      })
    })
  }

  goBack() {
    // this.nav.back()
    console.log(this.subformflag)
    if (this.subformflag) {
      let actiontype = "edit"
      this.router.navigate(["/new-form"], { queryParams: { unid: this.mainunid, aid: this.ulrs.aid, title: this.atitle, stat: this.ulrs.stat, type: actiontype, refresh: new Date().getTime(), cururl: this.lasturl } });
    } else {
      this.router.navigateByUrl(this.lasturl)
      //this.nav.navigateBack('/tabs/tab1',{queryParams:{title:this.portaltitle}});
    }


  }
  radioChange(field, value, sectiontitle){
    for (var i = 0; i < this.selecttemplat.template.hasSubFields.length; i++) {
      var sfield = this.selecttemplat.template.hasSubFields[i];
      //if(secId!=field.parentSecId) continue;
      var hasSubFieldEl = sfield.fieldId;
      if (hasSubFieldEl == field.name) {
        this.hasSubfieldChange(sfield, value,"change");
      }
    }
    this.selectScore(field, value, sectiontitle);
  }
  selectScore(field, value, sectiontitle) {

    this.sections.forEach(element => {
      // console.log(element)
      if (element.title == sectiontitle) {
        console.log(element.fields)
        element.fields.forEach(data => {
          if (field.name == data.name) {
            data.value = value
          }
        });
        let tempscore = 0;
        let num = 0
        element.fields.forEach(data => {
          if (data.xtype == "radio") {
            if (data.value == "Yes") {
              tempscore = tempscore + 1
            }
            num = num + 1
            if (data.value == "N/A") {
              num = num - 1
            }
          }
        });
        console.log(this.templatid)
        if (num != 0 && this.templatid == "GMP_AU") {
          element.score = tempscore + "/" + num + "   (" + (tempscore / num * 100) + "%)"
        }

      }

    });
  }
  getValue() {
    console.log('我选中的是', this.radio.value)
  }
  riskMatrix(selectedRiskMatrix, savedValue, riskName) {
    let obj: Object = {
      riskMatrixFrameData: selectedRiskMatrix,
      riskMatrixSaveData: savedValue,
      riskName,

      type: this.type,
      unid: this.ulrs.unid,
      aid: this.ulrs.aid,
      title: this.ulrs.title,
      stat: this.ulrs.stat,
      refresh: new Date().getTime(),
      cururl: this.lasturl,
      lasturl: this.router.url
    }
    this.nav.navigateBack('/risk-matrix', { queryParams: obj });
    //this.navCtrl.push(RiskMatrix, {riskMatrixFrameData:selectedRiskMatrix,riskMatrixSaveData:savedValue});
    //this.riskName=riskName;
  };
  hasSubfieldChange(field, v,stype:string) {
    if (!field.subField) return;
    var hideSubfield = [];
    //var showSubfield=[];
    let hasChildSubfields = [];
    for (let g = 0; g < field.subField.length; g++) {
      let ids = field.subField[g].id;
      for (var j = 0; j < ids.length; j++) {
        if (ids[j] == '') continue;
        var obj = field.parentSecId + '_' + ids[j];
        hideSubfield.push(obj);
        hideSubfield.push(ids[j]);
        let v = this.selecttemplat.template.hasSubFields.find(e => e.fieldId == obj || e.fieldId == ids[j]);
        if (v) hasChildSubfields.push(v.fieldId);
      }
    }

    this.hideSubfieldFunc(hideSubfield,stype,field.fieldType)
    //
    var v = (!v) ? "" : v;
    var array = [];
    if (typeof (v) == 'string') {

      array.push(v.trim());
    } else {
      array = array.concat(v);
    }
    let showSubfield = [];

    for (var i = 0; i < field.subField.length; i++) {


      if (array.indexOf(typeof (field.subField[i].displayWhen) == "string" ? field.subField[i].displayWhen : field.subField[i].displayWhen[0]) >= 0) {
        var ids = field.subField[i].id;
        for (let h = 0; h < array.length; h++) {
          if (array[h] == field.subField[i].displayWhen) {
            for (var j = 0; j < ids.length; j++) {

              if (ids[j] == '') continue;
              var obj = field.parentSecId + '_' + ids[j];
              // this.hasSubObjId=obj;
              showSubfield.push(obj);
              showSubfield.push(ids[j]);
            }//end for j loop
          }
        }


      }

    }
    this.showSubfieldFunc(showSubfield);

    for (let i = 0; i < hasChildSubfields.length; i++) {
      const pfid = hasChildSubfields[i];
      for (let j = 0; j < this.sections.length; j++) {
        let element = this.sections[j];
        if (element.fields) {
          let v = element.fields.find(e => e.name == pfid);
          if (v) {

            let hide = v.hide && v.hide == true ? true : false;
            if (hide) {
              let f = this.selecttemplat.template.hasSubFields.find(e => e.fieldId == pfid);
              if (f) {
                let hasSubFieldEl = f.subField;
                let hideSubfield = [];
                for (let g = 0; g < hasSubFieldEl.length; g++) {
                  let ids = hasSubFieldEl[g].id;
                  for (var m = 0; m < ids.length; m++) {
                    if (ids[m] == '') continue;
                    var obj = f.parentSecId + '_' + ids[m];
                    hideSubfield.push(obj);
                    hideSubfield.push(ids[m]);

                  }
                }
                this.hideSubfieldFunc(hideSubfield,stype,v.xtype);
              }
            } else {
              let val = v.value;
              let sval = (!val) ? "" : val;
              let array = [];
              if (typeof (sval) == 'string') {

                array.push(sval);
              } else {
                array = array.concat(sval);
              }
              let showSubfield = [];
              let f = this.selecttemplat.template.hasSubFields.find(e => e.fieldId == pfid);
              if (f) {

                for (let i = 0; i < f.subField.length; i++) {


                  if (array.indexOf(typeof (f.subField[i].displayWhen) == "string" ? f.subField[i].displayWhen : f.subField[i].displayWhen[0]) >= 0) {
                    let ids = f.subField[i].id;
                    for (let h = 0; h < array.length; h++) {
                      if (array[h] == f.subField[i].displayWhen) {
                        for (let j = 0; j < ids.length; j++) {

                          if (ids[j] == '') continue;
                          let obj = f.parentSecId + '_' + ids[j];
                          // this.hasSubObjId=obj;
                          showSubfield.push(obj);
                          showSubfield.push(ids[j]);
                        }//end for j loop
                      }
                    }


                  }

                }
                this.showSubfieldFunc(showSubfield);
              }

            }
            break;
          }
        }
      }

    }
  };
  showSubfieldFunc(showSubfield) {

    for (let e = 0; e < showSubfield.length; e++) {
      for (let c = 0; c < this.sections.length; c++) {
        if (this.sections[c].fields) {
          for (let d = 0; d < this.sections[c].fields.length; d++) {


            if (this.sections[c].fields[d].name == showSubfield[e]) {

              this.sections[c].fields[d].hide = false;
            }
          }
        }

      }

    }//End for loop


  };
  initHasSubfieldValue(hasSubFieldId) {
    let value;
    for (let c = 0; c < this.sections.length; c++) {
      if (this.sections[c].fields) {
        for (let d = 0; d < this.sections[c].fields.length; d++) {
          if (this.sections[c].fields[d].name == hasSubFieldId) {
            value = this.sections[c].fields[d].value;

          }
        }
      }

    }
    return value;
  }
  initHasSubfield(stype:string) {
    let hideSubfield = [];
    let showSubfield = [];
    let pid = [];
    //var showSubfield=[];
    for (var i = 0; i < this.selecttemplat.template.hasSubFields.length; i++) {
      var field = this.selecttemplat.template.hasSubFields[i];
      if (!field) continue;
      //if(secId!=field.parentSecId) continue;
      let hasSubFieldEl = field.subField;
      pid.push(field.fieldId);
      for (let g = 0; g < hasSubFieldEl.length; g++) {
        let ids = hasSubFieldEl[g].id;
        for (var j = 0; j < ids.length; j++) {
          if (ids[j] == '') continue;
          var obj = field.parentSecId + '_' + ids[j];
          hideSubfield.push(obj);
          hideSubfield.push(ids[j]);

        }
      }
    }
    this.hideSubfieldFunc(hideSubfield,stype);

    for (var m = 0; m < this.selecttemplat.template.hasSubFields.length; m++) {

      var showfield = this.selecttemplat.template.hasSubFields[m];

      let v = this.initHasSubfieldValue(showfield.fieldId);

      var array = [];
      if (!v) continue;
      if (typeof (v) == 'string') {

        array.push(v);
      } else {
        array = array.concat(v);
      }

      for (var n = 0; n < showfield.subField.length; n++) {


        if (array.indexOf(typeof (showfield.subField[n].displayWhen) == "string" ? showfield.subField[n].displayWhen : showfield.subField[n].displayWhen[0]) >= 0) {
          var ids = showfield.subField[n].id;
          for (let h = 0; h < array.length; h++) {
            if (array[h] == showfield.subField[n].displayWhen) {
              for (var j = 0; j < ids.length; j++) {

                if (ids[j] == '') continue;
                var obj = showfield.parentSecId + '_' + ids[j];
                // this.hasSubObjId=obj;
                showSubfield.push(obj);
                showSubfield.push(ids[j]);
              }//end for j loop
            }
          }


        }

      }
    }
    this.showSubfieldFunc(showSubfield);

    for (let i = 0; i < pid.length; i++) {
      const pfid = pid[i];
      for (let j = 0; j < this.sections.length; j++) {
        const element = this.sections[j];
        if (element.fields) {
          let v = element.fields.find(e => e.name == pfid);
          if (v) {

            let hide = v.hide && v.hide == true ? true : false;
            if (hide) {
              let f = this.selecttemplat.template.hasSubFields.find(e => e.fieldId == pfid);
              if (f) {
                let hasSubFieldEl = f.subField;
                let hideSubfield = [];
                for (let g = 0; g < hasSubFieldEl.length; g++) {
                  let ids = hasSubFieldEl[g].id;
                  for (var m = 0; m < ids.length; m++) {
                    if (ids[m] == '') continue;
                    var obj = f.parentSecId + '_' + ids[m];
                    hideSubfield.push(obj);
                    hideSubfield.push(ids[m]);

                  }
                }
                this.hideSubfieldFunc(hideSubfield,stype,v.xtype);
              }
            }
            break;
          }
        }
      }

    }
  };
  hideSubfieldFunc(hideSubfield,stype:string,fieldtype='select') {
    //this.hasSubFieldArray=hideSubfield;
    //var hideParentFieldIds=[];

    for (let c = 0; c < this.sections.length; c++) {
      if (this.sections[c].fields) {
        for (let d = 0; d < this.sections[c].fields.length; d++) {

          for (let e = 0; e < hideSubfield.length; e++) {
            if (this.sections[c].fields[d].name == hideSubfield[e]) {
              this.sections[c].fields[d].hide = true;
              if(fieldtype=='select'){
                if(stype=="change") this.sections[c].fields[d].value = '';
              }
            }
          }
        }
      }

    }//End for loop
  };
  getCheckValue(option, field) {
    let resvalue = [];
    field.options.forEach(option => {
      if (option.ischeck == true) {
        resvalue.push(option.value)
      } else {
        // resvalue.push("no")
      }
    });
    field.value = resvalue.join(",")
  }
  async  takePicture(name,field,att) {
    const actionSheetAttachment = await this.actionSheetCtrl.create({
      header: 'Add a Photo',
      buttons: [
        {
          text: 'Take a Photo',
          //role: 'destructive',
          handler: () => {
            this.platform.ready().then((readySource) => {
              this.addLatlonToImage(name,field);
            });
          }
        },
        {
          text: 'Select a Photo',
          handler: () => {
            this.platform.ready().then((readySource) => {
              this.selecPicture(name,field);
            });
          }
        },
        {
          text: 'Remove a Photo',
          handler: () => {
            this.attLists= field.value.filter(function(obj){
              return obj!=att;
            })
            field.value= this.attLists;
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
  
  async addLatlonToImage(name,field) {
    console.log("------------in addLatlonToImage------");
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
    if(field.value){
      field.value = field.value.concat( this.attLists);
    } else{
      field.value = this.attLists;
    }
   
  };
  setValue(name, data) {

    for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
      this.selecttemplat.template.secs[i].fields.forEach(item => {
        if (item.name == name) {
          console.log(data)
          item.value = data;
        }
      })

    }
  };
  async  GPSerror(error) {
    let alertGPSError = await this.alertController.create({
      header: 'integrumNOW',
      message: error,
      buttons: ['OK']
    });
    await alertGPSError.present();
  };
  async selecPicture(name,field) {
    console.log("------------in select picture------");
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
    if(field.value){
      field.value = field.value.concat( this.attLists);
    } else{
      field.value = this.attLists;
    }
    
  }
  async presentModal(stype:string) {
    const modal = await this.modal.create({
      component: OpenModalComponent
    });
   modal.present();
   const { data } = await modal.onDidDismiss();
   if (data.result == 'cancel') return false;
    if(stype=='delete'){
      this.deleteDoc(data.result);
    }else if(stype == 'reAssign'){
      this.reAssign(data.result);
    }
    
   
  }
  inheritValue(para) {
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(data => {
        this.getforms.inheritValue(data, para).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
          resolve(data);
        })
      })
    })
  }
  ngAfterViewInit(){

    console.log('ngAfterViewInit:',this.cbgcolor)
    const cusstyle:string = `--background:${this.cbgcolor}`;
    this.testdom.changes.subscribe((list:QueryList<any>)=>{
      if(list.length > 0){
      list.forEach( obj=>{
        obj.el.setAttribute("style",cusstyle)
      });
      }
    });
  }
  async getRiskmatrix(selectedRiskMatrix,fieldname,fieldvalue) {
    console.log('fieldvalue:',fieldvalue);
    let obj: Object = {
      riskMatrixFrameData: selectedRiskMatrix,
      riskMatrixSaveData: fieldvalue,
      riskName:fieldname,

      type: this.type,
      unid: this.ulrs.unid,
      aid: this.ulrs.aid,
      title: this.ulrs.title,
      stat: this.ulrs.stat,
      refresh: new Date().getTime(),
      cururl: this.lasturl,
      lasturl: this.router.url
    }
    const modal = await this.modal.create({
      showBackdrop: true,
      component: RiskmatrixComponent,
      componentProps: {obj}
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    console.log('data.result:',data.result);
    if(data.result!=''){
      for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
        if(this.selecttemplat.template.secs[i].fields){
          this.selecttemplat.template.secs[i].fields.forEach(item => {
            // console.log(fieldname)
            // console.log(item.name)
            if (item.name == fieldname) {
              item.value = JSON.parse(data.result);
            }
          })
        }
      }
    }
    
  }
  async getPersons(fieldvalue, stype: string, label ,btntype: string) {
    const cbgcolor = this.cbgcolor;
    const modal = await this.modal.create({
      showBackdrop: true,
      component: SecurityComponent,
      componentProps: { stype, fieldvalue, label, cbgcolor }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    if (data.result != '') {
      if(btntype=='submitToMr2'){
        this.submitToMr2(this.formID, data.result);
      }else if(btntype=='reAssign'){
        this.formmr = data.result;
        this.presentModal(btntype);
      }
      
    }
  }
  submitToMr2(unid:string,mr2:string) {
    const para = {unid,mr2};
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(logindata => {
        //this.getforms.getFormData(logindata, { "unid": "EBE27D0FEC6AEFF9482584D90020DCE6" }).pipe(first()).subscribe(data => {
        this.getforms.submitToMr2(logindata, para).pipe(first()).subscribe(data => {
          if(data.status=='success'){
            this.router.navigateByUrl(this.lasturl)
          }else{
            this.presentAlert("Error:<br/>" + data.reason, "", ["OK"])
          }
          

        })
        //resolve(data)
        //})
      })
    })
  }
  deleteDoc(cm: any){
    let unid: string = this.formID;
    const para: any = {
      //unid: this.ulrs.unid,
      unid,
      cm
    }
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.doDeleteDoc(logindata, para).pipe(first()).subscribe(data => {
        if (data.status == 'success') {
          this.router.navigateByUrl(this.lasturl);
        } else {
          this.presentAlert("failed!Error:" + data.result, "", "OK")
        }
      })
    })
  }
  reAssign(comments: string){
    let unid: string = this.formID;
    const para: any = {unid, comments, formmr: this.formmr};
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.doReAssign(logindata, para).pipe(first()).subscribe(data => {
        if (data.status == 'success') {
          this.router.navigateByUrl(this.lasturl);
        } else {
          this.presentAlert("failed!Error:" + data.result, "", "OK")
        }
      })
    })
  }
  async signaturePanel(fieldname) {

    let opt = { enableBackdropDismiss: false, cssClass: 'signature-popover' }
    //let popover: any;
    //popover = this.popoverController.create(SignaturepadPopover, {}, opt);
    //popover.present({
      // ev: myEvent
    //});
    const popover = await this.popoverController.create({
      component: SignaturepadPopover,
      componentProps: { },
      translucent: true,
      cssClass: "signature-popover",
      mode: "md"
    });
    popover.present();
    const { data } = await popover.onDidDismiss();
    for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
      if (this.selecttemplat.template.secs[i].fields) {
        this.selecttemplat.template.secs[i].fields.forEach(item => {
          // console.log(fieldname)
          // console.log(item.name)
          if (item.name == fieldname) {
            //console.log(data)
            //item.value = JSON.parse(data.result);
            item.value = data;

          }
        })
      }
    }

  };
}

