import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
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
import { RoleComponent } from "../../common/role/role.component";
import { MrtemplateComponent } from "../../common/mrtemplate/mrtemplate.component";
import { MicrodbComponent } from '../microdb/microdb.component';
import { FormDrafts } from '../../common/form-draft';

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
  public vid;
  public mr2Type;
  public mr2Val;
  public mr2Label:string = 'Select Final Reviewer';
  public reassignLabel: string = 'Select Person';
  public formmr;
  public microdbData:any = [];
  public orderbyImg: string = 'assets/icon/sort_none.gif';
  public orderbyState: boolean;
  public dynamicDatas:any = {};
  public status:string = "";
  public offlineFlag: boolean;
  public draftDocName: any;
  public newdoc: boolean = true;
  public serverdoc: boolean = false;
  public lastres: any;

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
    private sanitizer: DomSanitizer,
    private draftCtrl: FormDrafts
  ) {
    if(localStorage.getItem("bgcolor")){
      console.log('localStorage-->bgcolor:',localStorage.getItem('bgcolor'))
      this.cbgcolor = localStorage.getItem('bgcolor');
    }
    this.offlineFlag = localStorage.getItem('offlineFlag') ? (localStorage.getItem('offlineFlag') == "false" ? false : true) : false;
    let strnow = new Date();
    this.curDate = `${strnow.getFullYear()}-${(strnow.getMonth() + 1).toString().padStart(2, '0')}-${strnow.getDate().toString().padStart(2, '0')}`;
    
    this.storage.get('ous').then(data => {
      this.ous = data
    })

    this.storage.get('loginDetails').then(data => {
      console.log('logindetails:',data)
      //if(data.code=="integrum001") this.cbgcolor = "#3880ff";this.secbgcolor = "action";this.txtfontcolor="primary";
      console.log('--logindetails:',this.cbgcolor)
      this.initiator = data.username!=''?data.username:localStorage.getItem('user');
      this.initiatorOU = data.OUCategory!=''?data.OUCategory:localStorage.getItem('OUCategory');
    })
    this.activeRoute.queryParams.subscribe(res => {
      this.lastres = res;
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
      this.microdbData = [];
      this.portaltitle = res.temptitle
      this.subformflag = res.subform
      this.atitle = res.aTitle;
      this.vid = res.vid;
      this.mainunid = res.mainunid;
      if(this.offlineFlag){
        if(res.docname){
          this.draftDocName = res.docname;
          this.newdoc = false;
          this.serverdoc = false;
          this.getTemplateByAllForms(res);
          
        }else{
          //new doc
          this.newdoc = true;
          this.serverdoc = false;
          this.getTemplateByAllForms(res);
          
        }
      }else{
        if (res.unid) {
          this.lasturl = res.cururl
          this.fields = [];
          this.formID = res.unid
          console.log("旧文档")
          this.type = res.type
          /*if (res.stat && res.stat!='false') {
            this.title = res.title + " (" + res.stat + ")"
          } else {
            this.title = res.title
          }*/
          this.title = res.title;
          if (res.stat && res.stat!='false') {
            // this.status = "("+res.stat+")";
            this.status = res.stat ;
          }
          this.list = [
            { "show": false }
          ];
  
          this.commonCtrl.show();
          if (this.offlineFlag) {
            
          }else{
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
              console.log('selecttemplat:',this.selecttemplat)
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
                this.btnBox.result.forEach((val, index, arr) => {
                  if (val.btnType && val.btnType == 'btnExport2PDF') arr.splice(index, 1);
                });
                this.btnBox.result.forEach((val, index, arr) => {
                  if (val.btnType && val.btnType == 'btnExport2FWord') arr.splice(index, 1);
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
              console.log('selecttemplate:',this.selecttemplat.template)
              for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
                if (this.selecttemplat.template.secs[i].fields && this.selecttemplat.template.secs[i].sectionType!='1') {
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
                      if(v.value!='' && data.quesType==='singleselect') data.options.unshift({value:'',text:''});
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
                  }else if(data.xtype == 'headline'){
                    console.log('data.label:',data.label)
                    if(data.name == 'hsi_IncidentDetails_hsi_headlineCFOrg' || data.name == 'hsi_IncidentDetails_hsi_headlineCFHuman' || data.name == 'hsi_IncidentDetails_hsi_headlineCFTech') data.hide = true;
                    // if(this.findSameLabelname(this.selecttemplat.template.secs[i].fields,data.label,data.name)){
                    //   data.hide = true;
                    // }
                  }
                    this.fields.push(data) //
                    // this.selectScore(data,data.value,this.selecttemplat.template.secs[i].title)
                  })
                }else if(this.selecttemplat.template.secs[i].secId == "AuditTrail"){
                  if(this.selecttemplat.template.secs[i].secInfoContent && this.selecttemplat.template.secs[i].secInfoContent!=''){
                    
                      let secInfoContent = this.selecttemplat.template.secs[i].secInfoContent;
                      secInfoContent = secInfoContent.replace(/\n/g,'<br/>');
                      this.selecttemplat.template.secs[i].secInfoContent = secInfoContent
                      selectSecId.push('AuditTrail');
                    }
                }
                if(this.selecttemplat.template.secs[i].sectionType=='1'){
                  console.log('this.selecttemplat.template.secs[i]:',this.selecttemplat.template.secs[i])
                  const { secId, title, fields, enableHideRemoveButton, IsMircroSort, microData: { IsSupperUser, dcData } } = this.selecttemplat.template.secs[i];
                  console.log('this.microdbData:',this.microdbData);
                  const microsec = this.selecttemplat.template.secs[i];
                  if(IsMircroSort == 'ka_Yes'){
                      const sortField = microsec.sortField;
                      microsec.sortFieldName = sortField;
                      if(sortField.includes(' '))  microsec.sortFieldName = sortField.split(' ')[0];
                      microsec.sortStatus = 'N';
    
                      const sortIndex = microsec.dispFields.findIndex( e => e.id == microsec.sortFieldName);
                      microsec.sortIndex = sortIndex;
                  }
                  this.microdbData.push({ secId, title, fields, enableHideRemoveButton, IsMircroSort,  IsSupperUser, dcData  });
                }
                // console .log(this.selecttemplat.template.secs[i])
                // console.log(this.selecttemplat.template.secs[i].secId)
                if (selectSecId.indexOf(this.selecttemplat.template.secs[i].secId) != -1) this.sections.push(this.selecttemplat.template.secs[i])
                //if(this.quesSecId.indexOf(this.selecttemplat.template.secs[i].secId)==-1) this.sections.push(this.selecttemplat.template.secs[i])
                this.sectionsold.push(this.selecttemplat.template.secs[i])
                if(this.selecttemplat.template.secs[i].dynamicData){
                  let dynamicJson = {};
                  dynamicJson["fields"] = this.selecttemplat.template.secs[i].fields;
                  dynamicJson["dynamicData"] = this.selecttemplat.template.secs[i].dynamicData;
                  this.dynamicDatas[this.selecttemplat.template.secs[i].secId] = dynamicJson;
                }
    
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
              this.comPercents();
              //})
            })
          }
          
        } else {
          this.getTemplateByAllForms(res);      
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
      console.log('new selecttemplate:',this.selecttemplat)
      this.mandatoryWhenApprove = this.selecttemplat.mandatoryWhenApprove?this.selecttemplat.mandatoryWhenApprove:"0";
      this.skipMandatory = this.selecttemplat.skipMandatory?this.selecttemplat.skipMandatory:"0";
      this.title = this.selecttemplat.template.templateTitle;
      this.sysfields = this.selecttemplat.template.secs[0].fields;
      this.mandafields = this.selecttemplat.template.mandaFields;
      this.templatid = this.selecttemplat.template.templateId;
      if (this.offlineFlag) {
        // const menubar = this.selecttemplat.menubaritem;
        // const result = menubar.result;
        // if (result) {
        //   const newarr = result.filter(e => e.btnType == 'btnClose' || e.btnType == 'btnSave');
        //   menubar.result = newarr;
        // }
        // this.btnBox = menubar;
        if(res.docname){
          this.type = res.type;
          this.storage.get('offlinemuitldata').then( d =>{
            d = JSON.parse(d);
            if(this.type == 'open'){
              this.btnBox = {
                "result": [
                  { "btnType": "btnEdit", "btnLabel": d.online.btnedit?d.online.btnedit:'Edit' },
                  { "btnType": "btnDelete", "btnLabel": d.online.btndelete?d.online.btndelete:'Delete' },
                  { "btnType": "btnClose", "btnLabel": d.online.btnclose?d.online.btnclose:"Close" }
                ]
              };
            }else{
              this.btnBox = {
                "result": [
                  { "btnType": "btnSave", "btnLabel": d.online.btnsave?d.online.btnsave:'Save' },
                  { "btnType": "btnDelete", "btnLabel": d.online.btndelete?d.online.btndelete:'Delete' },
                  { "btnType": "btnClose", "btnLabel": d.online.btnclose?d.online.btnclose:"Close" }
                ]
              };
            }
          })
          console.log('this.templatid:',this.templatid);
          this.title = res.title;
          this.status = res.stat;
          this.storage.get(this.draftDocName).then(data => {
            data = JSON.parse(data);
            const allfields: any = data.fields;
            const createTime: any = data.createTime;
            const secs: any = this.selecttemplat.template.secs;
            for (let i = 0; i < secs.length; i++) {
              const fields = secs[i].fields;
              for (let j = 0; j < fields.length; j++) {
                const field = fields[j];
                const f: any = allfields.find( e => e.name == field.name);
                if(f && f.value){
                  field.value = f.value;
                }
              }
            }
            this.setInitValue(res,createTime);
          }).catch(e=>{
            console.log(this.draftDocName,' error:',e);
          })
        }else{
          this.storage.get('offlinemuitldata').then( d =>{
            d = JSON.parse(d);
            this.btnBox = {
              "result": [
                { "btnType": "btnSave", "btnLabel": d.online.btnsave?d.online.btnsave:'Save' },
                { "btnType": "btnClose", "btnLabel": d.online.btnclose?d.online.btnclose:"Close" }
              ]
            };
              
          })
          this.setInitValue(res);
        }
      } else {
        this.btnBox = this.selecttemplat.menubaritem;
        this.setInitValue(res);
      }

      
    })
  }
  setInitValue(res: any,savedOfflineDoc?: any){
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
          if(v.value!='' && data.quesType==='singleselect') data.options.unshift({value:'',text:''});
        }
        const val: any = data.value;
          if(val){
            const quesFields: any = this.selecttemplat.template.quesFields;
            const qfield: any = quesFields.find(e => e.fieldId == data.name);
            if(qfield){
              const qsec: any = qfield.answerWhen[val];
              for (let i = 0; i < qsec.length; i++) {
                const secId = qsec[i];
                const index: number = this.quesSecId.findIndex(e => e == secId);
                if (index != -1) this.quesSecId.splice(index, 1);
              }
            }
          }
      } else if(data.xtype == 'headline'){
        // if(this.findSameLabelname(this.selecttemplat.template.secs[i].fields,data.label,data.name)){
        //   data.hide = true;
        // }
        if(data.name == 'hsi_IncidentDetails_hsi_headlineCFOrg' || data.name == 'hsi_IncidentDetails_hsi_headlineCFHuman' || data.name == 'hsi_IncidentDetails_hsi_headlineCFTech') data.hide = true;
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
      if(this.selecttemplat.template.secs[i].dynamicData){
        let dynamicJson = {};
        dynamicJson["fields"] = this.selecttemplat.template.secs[i].fields;
        dynamicJson["dynamicData"] = this.selecttemplat.template.secs[i].dynamicData;
        this.dynamicDatas[this.selecttemplat.template.secs[i].secId] = dynamicJson;
      }
    }
    if(savedOfflineDoc){
      const auditSec: any = this.selecttemplat.template.secs.find(sec => sec.secId == "AuditTrail");
      if(!auditSec){
        const section: any = {
          secId: "AuditTrail",
          secInfoContent: `***** Created by ${this.initiator} from offline mode on ${savedOfflineDoc} *****`,
          title: "Audit Trail"
        };
        this.selecttemplat.template.secs.push(section);
        this.sections.push(section);
      }
    }
    this.initHasSubfield('change');
    let flag = this.sections.some(function (obj, index) {
      //console.log(obj.title)
      return obj.title == "Severity"
    })
    if (flag) {
      this.change({ "label": "Severity" })
    }
    this.comPercents();
  }
  getTemplateByAllForms(res: any){
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
  comPercents(){  
    const secs = this.selecttemplat.template.secs;
    secs.forEach(sec => {
      if(sec.dynamicData){
        let tempscore = 0;
        let naNum = 0;
        let total = sec.dynamicData.quesList.length;
        sec.dynamicData.quesList.forEach((data,index) => {
          if(data.length>1){
            if (data[1] == "Yes") {
              tempscore = tempscore + 1
            }
            if (data[1] == "N/A"||data[1] == "NA") {
              naNum = naNum + 1
            }
          } 
        });
        if (total != 0) { 
          let result:string = (tempscore*100 / (total-naNum)).toFixed();
          console.log(result);
          sec.score = tempscore + "/" + (total-naNum) + "   (" + ( result) + "%)"
        }
      }
    });
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
  comScores(dynamicDatas):any {  
    for (let key in dynamicDatas) {
      var dynamicData = dynamicDatas[key]["dynamicData"];
      if (dynamicData) {
        let tempscore = 0;
        let naNum = 0;
        let result = "";
        let total = dynamicData.quesList.length;
        let tolNoNa = 0;
        let comResult = ""
        dynamicData.quesList.forEach((data, index) => {
          if (data.length > 1) {
            if (data[1] == "Yes") {
              tempscore = tempscore + 1
            }
            if (data[1] == "N/A"||data[1] == "NA") {
              naNum = naNum + 1
            }
          }
        });
        if (total != 0) {
          result = (tempscore * 100 / (total - naNum)).toFixed();
          comResult =tempscore + "/" + (total-naNum) + "   (" + (result) + "%)";
          tolNoNa = total-naNum;
        }
        var scoreList = []
        scoreList.push(tempscore);
        scoreList.push(tolNoNa);
        scoreList.push(result);
        scoreList.push(comResult);
      }
      dynamicDatas[key]["score"] = scoreList;
    }   
       
  }

  ngOnInit() {

    //console.log(this.sections[0])

  }


  ionViewDidLoad() {

  };


  isShowGuidance(section, index) {
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
        if(this.offlineFlag){
          const {aid, cururl, docname, stat, title} = this.lastres;
          const type = 'edit'
          const newres: any = {aid, cururl, docname, stat, title, type}
          this.router.navigate(["/new-form"], { queryParams: newres});
        }else{
          actiontype = "edit";
          this.router.navigate(["/new-form"], { queryParams: { unid: this.ulrs.unid, aid: this.ulrs.aid, title: this.ulrs.title, stat: this.ulrs.stat, type: actiontype, refresh: new Date().getTime(), cururl: this.lasturl } });
        }
        
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
          const {fieldError,msg} = this.checkMandatoryField("save");
          if (fieldError) {
            console.log("必填了")
            console.log(msg)
            this.presentAlert("The follow fields are mandatory:<br/>" + msg, "", ["OK"])
            return false;
          }
        }
        var saveDyDatas = this.saveDyDatas();
        console.log(saveDyDatas);
        this.comScores(saveDyDatas);
        this.paraforsubmit.dynamicDatas = saveDyDatas;
        if (this.offlineFlag) {
          console.log('offline save');
          if(this.newdoc){
            this.paraforsubmit.app_offline_NewForm = "1";
          }else{
            if(this.serverdoc){
              this.paraforsubmit.app_offline_Update = "1";
            }else{
              this.paraforsubmit.app_offline_NewForm = "1";
            }
          }
          this.offlineSave(this.paraforsubmit);
        } else {
          this.submit(this.paraforsubmit, actiontype)
        }
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
          const {fieldError,msg} = this.checkMandatoryField("submit");
          if (fieldError) {
            console.log("必填了")
            console.log(msg)
            this.presentAlert("The follow fields are mandatory:<br/>" + msg, "", ["OK"])
            return false;
          }
        }
        var saveDyDatas = this.saveDyDatas();
        console.log(saveDyDatas);
        this.comScores(saveDyDatas);
        this.paraforsubmit.dynamicDatas = saveDyDatas;
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
        console.log(this.sysfields);
        const formMR = this.sysfields.find(item => item.name == 'formMR')
        if(formMR.xtype =='select'){
          this.getReassignMrByTemplate('','single',this.reassignLabel,formMR.options)
        }else{
          this.getPersons('', 'single', this.reassignLabel, 'reAssign')
        }
        break;
      case "btnApprove":
        this.presentModal('approve');
        break;
      case "btnReject":
          this.presentModal('reject');
          break;
      case "btnReopen":
            this.presentModal('reopen');
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
  checkMandatoryField(action):any{
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
                  msg += this.selecttemplat.template.mandaFields[p].label + ' date cannot be less than current date<br/>';
                  fieldError = true;
                }
              }
            }
          }
        }
      }
    }//End
    if(action=="submit" || (action == "save" && this.skipMandatory == "0")){
      msg = this.checkQuesMandatory(msg);
      if(msg) fieldError = true;
    }

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
            if(!this.formID){      
              this.router.navigate(['/form-list'],{queryParams:{vid:this.vid,vtitle:this.title,type:'formlist',formid:this.ulrs.aid,temptitle:this.portaltitle}});
            }else{
              this.router.navigateByUrl(this.lasturl);
            }
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
      if (field.value != '' && field.value != ['']) {
        let disSecId:any = [];
        if(Array.isArray(field.value)){
          field.value.forEach(e => {
            disSecId = disSecId.concat(v.answerWhen[e]);
          });
        }else{
          disSecId = v.answerWhen[field.value];
        }
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
  async getSecurity(field, stype:string) {
    const { name, value, label, xtype} = field;
    const modal = await this.modal.create({
      showBackdrop: true,
      component: SecurityComponent,
      componentProps: {stype,value,label,cbgcolor:this.cbgcolor }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    for (let i = 0; i < this.selecttemplat.template.secs.length; i++) {
      if(this.selecttemplat.template.secs[i].fields){
        this.selecttemplat.template.secs[i].fields.forEach(item => {
          // console.log(fieldname)
          // console.log(item.name)
          if (item.name == name) {
            // console.log(data)
            item.value = data.result;
          }
        })
      }

    }
    if(xtype == 'singleempselect'){
      const groupId = field.groupId;
      if(groupId && groupId!=''){
        this.commonCtrl.show();
        const secId = field.secId;
        const sec = this.selecttemplat.template.secs.find(item => item.secId == secId);
        if(sec){
          console.log('sec:',sec)
          const fields = sec.fields;
          //const relafields = fields.filter(e => e.groupId == groupId)
          const relafields = [];
          fields.forEach(e => {
            if(e.groupId == groupId) relafields.push(e.mapFieldId);
          });
          if(relafields.length>0){
            this.getFieldVal(relafields.join(';'),data.result,fields)
          }
          
        }else{
          this.commonCtrl.hide();
        }
      }
    }


  }
  getFieldVal(fields: string, fullname: string,sec: any){
    
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.getFieldValue(logindata, fields,fullname).pipe(first()).subscribe(data => {
        data = JSON.parse(data.data);
        sec.forEach(e => {
          if(e.mapFieldId!=''){
            if(data[e.mapFieldId]!=null) e.value = data[e.mapFieldId];
          }
        });
        this.commonCtrl.hide();
      })
    })
  }
  //查找名称
  async getRole(fieldname, fieldvalue,stype:string,label,rolelist) {
    const modal = await this.modal.create({
      showBackdrop: true,
      component: RoleComponent,
      componentProps: {stype,fieldvalue,label,cbgcolor:this.cbgcolor,rolelist }
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
  //
  async getMrByTemplate(fieldname, fieldvalue,stype:string,label,rolelist) {
    const modal = await this.modal.create({
      showBackdrop: true,
      component: MrtemplateComponent,
      componentProps: {stype,fieldvalue,label,cbgcolor:this.cbgcolor,rolelist }
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
  async getReassignMrByTemplate( fieldvalue,stype:string,label,rolelist) {
    const modal = await this.modal.create({
      showBackdrop: true,
      component: MrtemplateComponent,
      componentProps: {stype,fieldvalue,label,cbgcolor:this.cbgcolor,rolelist }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    if (data.result != '') {
      this.formmr = data.result;
        this.presentModal('reAssign');
      
    }

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
    let fval: any = field.value;
    if(field.options){
      const v = field.options.find(e => e.text == fval);
      if(v) fval = v.value;
    }
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
      val = fval;
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
        let element = v.options.subfieldlist.list.find(e => e.value == fval);
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
        this.hasSubfieldChange(sfield, fval,stype);
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
        //console.log(element.fields)
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
        //console.log(this.templatid)
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

   if (data.data != 'cancel'){
    if(stype=='delete'){
      this.deleteDoc(data.data);
    }else if(stype == 'reAssign'){
      this.reAssign(data.data);
    }else if(stype == 'approve'){
      this.approve(data.data);
    }else if(stype == 'reject'){
      this.reject(data.data);
    }else if(stype == 'reopen'){
      this.reopen(data.data);
    }
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
          data = JSON.parse(data.data);
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
        data = JSON.parse(data.data);
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
        data = JSON.parse(data.data);
        if (data.status == 'success') {
          this.router.navigateByUrl(this.lasturl);
        } else {
          this.presentAlert("failed!Error:" + data.result, "", "OK")
        }
      })
    })
  }
  approve(comments: string){
    let unid: string = this.formID;
    const para: any = {unid, comments};
    this.commonCtrl.processShow('Processing...');
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.doApprove(logindata, para).pipe(first()).subscribe(data => {
        data = JSON.parse(data.data);
        this.commonCtrl.processHide();
        if (data.status == 'success') {
          this.router.navigateByUrl(this.lasturl);
        } else {
          this.presentAlert("failed!Error:" + data.result, "", "OK")
        }
      })
    })
  }
  reject(comments: string){
    let unid: string = this.formID;
    const para: any = {unid, comments};
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.doReject(logindata, para).pipe(first()).subscribe(data => {
        data = JSON.parse(data.data);
        if (data.status == 'success') {
          this.router.navigateByUrl(this.lasturl);
        } else {
          this.presentAlert("failed!Error:" + data.result, "", "OK")
        }
      })
    })
  }
  reopen(comments: string){
    let unid: string = this.formID;
    const para: any = {unid, comments};
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.doReopen(logindata, para).pipe(first()).subscribe(data => {
        data = JSON.parse(data.data);
        console.log('reopen:',data)
        if (data.status == 'success') {
          this.router.navigateByUrl(this.lasturl);
        } else {
          this.presentAlert("failed!Error:" + data.reason, "", "OK")
        }
      })
    })
  }
  getPeopleByRole(para) {
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(data => {
        this.getforms.getPeopleByRole(data, para).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
          if (data.status == 'success') {
            var rolelist=""
            for(var i=0;i<data.res.length;i++){
              rolelist=rolelist+"<ion-item>"+data.res[i]+"</ion-item>";
            }
            this.presentAlert("<div>"+rolelist+"</div>", "", ["Close"]);
          } else {
            this.presentAlert("failed!Error:" + data.res, "", "OK")
          }
        })
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
  async newMicrodb(unid: string, section:any) {
    const cbgcolor = this.cbgcolor;
    const type = this.type;
    const mianunid = this.formID;
    section.fields.forEach(e => {
      if(e.value) delete e.value;
    });
    const modal = await this.modal.create({
      showBackdrop: true,
      component: MicrodbComponent,
      componentProps: {  section, cbgcolor , unid, mianunid, type }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    
    console.log('data:',data);
    if(data.result == 'success'){
      this.reUpdateMicrodbData(section.secId,data.unid,data.firstDisVal, data.firstDisType ,data.secondDisVal, data.secondDisType, data.thirdDisVal, data.thirdDisType);
    }
  };
  reUpdateMicrodbData(secId: string, unid: string, firstDisVal: any, firstDisType: any, secondDisVal: any, secondDisType:any, thirdDisVal: any, thirdDisType: any){
    const microdb = this.microdbData.find(item=>item.secId==secId);
    if(microdb){
      const doc = microdb.dcData.find(e => e[0] == unid );
      if(doc){
        if(firstDisVal) doc[1][0] = firstDisVal;
        if(secondDisVal) doc[2][0] = secondDisVal;
        if(thirdDisVal) doc[3][0] = thirdDisVal
      }else{
        const arr: any = [];
        arr[0] = unid;
        arr[1] = [firstDisVal, firstDisType];
        arr[2] = [secondDisVal, secondDisType];
        arr[3] = [thirdDisVal, thirdDisType];
        microdb.dcData.push(arr);
      }
      
    }
  }
  getMicrodbData(secId: string){
    const arr = [];
    const microdb = this.microdbData.find(item=>item.secId==secId);
    if(microdb){
      microdb.dcData.forEach(e => {
        const obj = { 
          unid:'',
          firstcolval: '', 
          firstcoltype: '', 
          secondcolval: '', 
          secondcoltype: '',
          thirdcolval: '',
          thirdcoltype: ''
        };
        obj.unid = e[0];
        const firstcol = e[1];
        if(firstcol){
          obj.firstcolval = e[1][0];
          const firstcoltype = e[1][1];
          if(firstcoltype) obj.firstcoltype = firstcoltype.indexOf(' ') > -1?firstcoltype.split(' ')[0]:firstcoltype;
          obj.firstcolval = this.formatValue(obj.firstcolval, obj.firstcoltype)
        }
        
        const secondcol = e[2];
        if(secondcol){
          obj.secondcolval = e[2][0];
          const secondcoltype = e[2][1];
          if(secondcoltype) obj.secondcoltype = secondcoltype.indexOf(' ') > -1?secondcoltype.split(' ')[0]:secondcoltype;
          obj.secondcolval = this.formatValue(obj.secondcolval, obj.secondcoltype)
        }
        const thirdcol = e[3];
        if(thirdcol){
          obj.thirdcolval = e[3][0];
          const thirdcoltype = e[3][1];
          if(thirdcoltype) obj.thirdcoltype = thirdcoltype.indexOf(' ') > -1?thirdcoltype.split(' ')[0]:thirdcoltype;
          obj.thirdcolval = this.formatValue(obj.thirdcolval, obj.thirdcoltype)
        }
        arr.push(obj);
      });
      
    }
    return arr;
  }
  formatValue(val:any, type: string){
    if(type == 'date'){
      if(val) val = moment(`${val}`, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }else if(type == 'time'){
      if(val) val =moment(`${val}`, 'YYYY-MM-DD hh:mm:ss').format('hh:mm');
    }
    return val;
  }
  removeMicroDoc(unid: string, secId: string){
    
    this.storage.get('loginDetails').then(logindata => {
      this.getforms.removeDoc(logindata, unid).pipe(first()).subscribe(data => {
        data = JSON.parse(data.data);
        console.log('removeMicroDoc:',data)
        if (data.result == 'success') {
          console.log('***this.microdbdata:',this.microdbData);
          this.updateMicrodbData(secId, unid);
        } else {
          this.presentAlert("failed!Error:" + data.result, "", "OK")
        }
      })
    })
  }
  updateMicrodbData(secId: string,unid: string){
    const microdb = this.microdbData.find(item=>item.secId==secId);
    if(microdb){
      const index = microdb.dcData.findIndex(e => e[0] && e[0] == unid);
      if(index>-1){
        microdb.dcData.splice(index,1);
      }
    }
  }
  microsort(section: any){
    if(section.sortIndex < 2 && section.sortIndex > -1){
      const sortIndex = section.sortIndex;
      this.orderbyState = !this.orderbyState;
      const secId: string = section.secId;
      const microdb = this.microdbData.find(item=>item.secId==secId);
      if(this.orderbyState){
        this.orderbyImg = 'assets/icon/sort_both_ascending.gif';
        microdb.dcData.sort(this.fnsort(sortIndex+1));
      }else{
        this.orderbyImg = 'assets/icon/sort_both_descending.gif';
        microdb.dcData.sort(this.fnsort(sortIndex+1)).reverse() ;
      }
    }
  }
  fnsort(index){
    return   (o, p)=> {
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[index][0];
        b = p[index][0];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      }
      else {
        throw ("error");
      }
    }
  }
  findSameLabelname(fields: any, label: string, name: any): boolean{
    console.log('name:',name,' label:',label)
    const result = fields.find(e => e.name!=name && e.label==label);
    console.log('findSameLabelname result:',result)
    if(result) return true;
    return false;
  }
  checkQuesMandatory(msg) {
    /*var checkSecs = [];
    checkSecs = this.isShowSec();

    this.selecttemplat.template.secs.forEach(sec => {
      var dyMsg = "";
      if (sec.dynamicData) {
        if (this.quesSecId.indexOf(sec.secId) == -1||!this.quesSecId) {
          sec.dynamicData.quesList.forEach((q, index) => {
            if (!q[1]) {
              dyMsg += "Q" + (index + 1) + ",";
            }
          });
        } else {
          if (checkSecs.length > 0) {
            checkSecs.forEach(checkSec => {
              if (checkSec.indexOf(sec.secId) != -1) {
                sec.dynamicData.quesList.forEach((q, index) => {
                  if (!q[1]) {
                    dyMsg += "Q" + (index + 1) + ",";
                  }
                });
              }
            })
          }
        }
      }
      if (dyMsg != "") {
        dyMsg = sec.title + ":" + dyMsg;
        dyMsg = dyMsg.slice(0, dyMsg.length - 1);
        dyMsg = dyMsg + "<br>";
        msg += dyMsg;      
      }
    })
    */
   const sections = this.sections.filter(section => section.sectionType=='1' && section.dynamicData);
   if(sections.length > 0 ){
     
     sections.forEach(sec => {
      let dyMsg = '';
      sec.dynamicData.quesList.forEach((q, index) => {
        if (!q[1]) {
          dyMsg += "Q" + (index + 1) + ",";
        }
      });
      if (dyMsg != "") {
        dyMsg = sec.title + ":" + dyMsg;
        dyMsg = dyMsg.slice(0, dyMsg.length - 1);
        dyMsg = dyMsg + "<br>";
        msg += dyMsg;      
      }
     });
   }
    return msg;
  }
  saveDyDatas() {
    var saveDyDatas = {};
    console.log('this.sections:',this.sections)
    console.log('this.dynamicDatas:',this.dynamicDatas)
    for (var key in this.dynamicDatas) {
      const v = this.sections.find(e => e.secId == key);
      if(v){
        saveDyDatas[key] = this.dynamicDatas[key];
      }
    }
    return saveDyDatas;
  }
  saveDynamicData(info,section){
    const {index, fields} = info;
    section.index = index;
    console.log('info:',info)
    fields.forEach((e,i) => {
      section.dynamicData.quesList[index][i] = e.value;
    });
    console.log('saveDynamicData ---section:',section)
  }
  offlineSave(paraforsubmit: any) {
    const d = new Date();
    const n = d.getTime();
    const newFileName = 'Draft' + n;
    const oldFilename = this.draftDocName;
    //let draftSavedTime = d.toString().substr(0, 21);
    let draftSavedTime = moment(new Date()).format('DD/MM/YYYY');
    let ifFileExist: boolean = false;

    const draftLists = this.draftCtrl.getSavedFiles(this.templatid);
    //check if file exist
    for (let p = 0; p < draftLists.length; p++) {

      if (draftLists[p].name == oldFilename) {
        ifFileExist = true;
        break;
      }

    }
    let initiatorOrMR: any = this.initiator;
    const mr: any = paraforsubmit.fields.find(e => e.name == "formMR");
    if(mr){
      if(mr.value && mr.value != '') initiatorOrMR = mr.value;
    }
    let formduedate: any;
    const formduedatefield: any = paraforsubmit.fields.find(e => e.name == "FormDueComDate");
    if(formduedatefield){
      if(formduedatefield.value && formduedatefield.value != '') formduedate = formduedatefield.value;
    }
    if(formduedate){
      //draftSavedTime = formduedate;
    }
    if (ifFileExist) {
      this.storage.set(oldFilename, JSON.stringify(paraforsubmit)).then((data) => {
        const status: string = this.getStatusText(this.status);
        console.log('status:',status,'----this.status:',this.status)
        this.draftCtrl.updateStatus(oldFilename, status, this.status, this.templatid, draftSavedTime, initiatorOrMR);
        if (this.subformflag) {
          this.router.navigate(["/new-form"], { queryParams: { unid: this.mainunid, aid: this.ulrs.aid, title: this.atitle, stat: this.ulrs.stat, type: 'edit', refresh: new Date().getTime(), cururl: this.lasturl } });
        } else {
          if(!this.formID){      
            this.router.navigate(['/form-list'],{queryParams:{vid:this.vid,vtitle:this.title,type:'formlist',formid:this.ulrs.aid,temptitle:this.portaltitle}});
          }else{
            this.router.navigateByUrl(this.lasturl);
          }
        }

      });

    }
    else {
      //this.storage.ready().then(db=>{
        paraforsubmit.createTime = moment(new Date()).format('DD-MM-YYYY HH:mm');
        console.log('newfilename:',newFileName,'paramer:',paraforsubmit)
        this.storage.set(newFileName, JSON.stringify(paraforsubmit));
          const status: string = 'ka_Draft';
          const WFStatus: string = 'Draft';
          if(localStorage.getItem('allTemplateID')){
            const templateIDs = JSON.parse(localStorage.getItem('allTemplateID'));
            const n = templateIDs.findIndex(e => e == this.templatid);
            if(n==-1){
              templateIDs.push(this.templatid);
              localStorage.setItem('allTemplateID',JSON.stringify(templateIDs));
            }
          }else{
            const templateIDs = [];
            templateIDs.push(this.templatid);
            localStorage.setItem('allTemplateID',JSON.stringify(templateIDs));
          }
          console.log('**************************222')
          this.draftCtrl.saveFiletoBepersisted(newFileName, status, this.templatid, this.vid, draftSavedTime, initiatorOrMR, WFStatus);
          console.log('onffline save this.lasturl:',this.lasturl)
          if (this.subformflag) {
            this.router.navigate(["/new-form"], { queryParams: { unid: this.mainunid, aid: this.ulrs.aid, title: this.atitle, stat: this.ulrs.stat, type: "edit", refresh: new Date().getTime(), cururl: this.lasturl } });
          } else {
            if(!this.formID){      
              this.router.navigate(['/form-list'],{queryParams:{vid:this.vid,vtitle:this.title,type:'formlist',formid:this.ulrs.aid,temptitle:this.portaltitle}});
            }else{
              this.router.navigateByUrl(this.lasturl);
            }
          }
          // this.navCtrl.pop();
          // this.draftCtrl.clearRiskMatrixObj();
          // this.microDbName = '';
          // this.draftCtrl.clearMicroFileName();
          // this.clearInput();

     // })
      

    }//End file exit else
  }
  getStatusText(v: string){
    const status={"Draft":"ka_Draft","Open":"ka_Open","Approved":"ka_Approved","Completed":"ka_Completed","Rejected":"ka_Rejected","Pending Acceptance":"ka_PAccept","Approved-Pending Form MR":"ka_APFM","Signed-Off":"ka_Signed-Off","Pending Management Representative Review":"ka_PMRR","In Review":"ka_INRW"};
	  return status[v]?status[v]:v;
  }
}

