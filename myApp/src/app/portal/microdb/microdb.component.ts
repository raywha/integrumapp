import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { commonCtrl } from "../../common/common";
import { SignaturepadPopover } from '../signaturepad-popover/signaturepad-popover';
import { DomSanitizer } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { GetallformsService } from "../../services/getallforms.service";
import * as moment from 'moment';
import { SecurityComponent } from "../../common/security/security.component"

@Component({
  selector: 'app-microdb',
  templateUrl: './microdb.component.html',
  styleUrls: ['./microdb.component.scss'],
  providers: [commonCtrl]
})
export class MicrodbComponent implements OnInit {
  public cbgcolor: any;
  public fields: any;
  public secId: any;
  public title: any;
  public unid: any;
  public mianunid: any;
  public type: any;
  public doctype: string = 'open';
  public dispFields: any;
  public firstDisVal: any;
  public firstDisType: any;
  public secondDisVal: any;
  public secondDisType: any;
  public thirdDisVal: any;
  public thirdDisType: any;
  public msection: any;
  public curDate: string = '';
  public maxYear: string = "2040";
  constructor(
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private storage: Storage,
    public getforms: GetallformsService,
    public popoverController: PopoverController,
    public alertController: AlertController,
    public modal: ModalController,
    public commonCtrl: commonCtrl
    ) { }

  ngOnInit() {
    console.log('this.navParams.data:',this.navParams.data);
    //const { cbgcolor, section:{ fields, secId, dispFields, title, isReadyOnly, microData: { IsSupperUser } }, unid, mianunid, type } = this.navParams.data;
    const { cbgcolor, section: msection, unid, mianunid, type } = this.navParams.data;
    const { fields, secId, dispFields, title, isReadyOnly, microData: { IsSupperUser } } = msection;

    let strnow = new Date();
    this.curDate = `${strnow.getFullYear()}-${(strnow.getMonth() + 1).toString().padStart(2, '0')}-${strnow.getDate().toString().padStart(2, '0')}`;
    console.log('msection:',msection);
    this.msection = msection;
    this.cbgcolor = cbgcolor;
    this.fields = fields;
    this.secId = secId;
    this.dispFields = dispFields;
    this.title = title;
    this.unid = unid;
    this.mianunid = mianunid;
    this.type = type;
    this.doctype = 'open';
    if(type=='edit'){
      if(isReadyOnly == 'ka_Yes'){
        if(IsSupperUser) this.doctype = 'edit';
      }else{
        this.doctype = 'edit'
      }
    }
    if(unid){
      console.log('unid:',unid);
      this.getFormData(unid).then(data => {
        console.log('data :',data);
        fields.forEach(e => {
          if(data[e.name]){
            e.value = data[e.name]
          }
          //if(this.type!='edit'){
            if(e.xtype == 'date'){
              if(e.value) e.value = moment(`${e.value}`, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
            }else if(e.xtype == 'time'){
              if(e.value) e.value = moment(`${e.value}`, 'YYYY-MM-DD hh:mm:ss').format('hh:mm');
            }
          //}
        });
      })
    }
  }

  dismiss() {
    this.navParams.data.modal.dismiss({
      result: ''
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
    this.fields.forEach(item => {
      // console.log(fieldname)
      // console.log(item.name)
      if (item.name == fieldname) {
        //item.value = JSON.parse(data.result);
        item.value = data;
      }
    })

  };
  getFormData(unid: any) {
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(data => {
        this.getforms.getDocData(data, this.unid).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
          resolve(data)
        })
      })
    })
  }
  saveDoc(){
    const { fieldError, msg } = this.checkMandatoryField();
    if (fieldError) {
      this.presentAlert("The follow fields are mandatory:<br/>" + msg, "", ["OK"])
      return false;
    }
    this.save();
  }
  checkMandatoryField() {
    let msg = "";
    let fieldError = false;
    const firstDispName = this.dispFields && this.dispFields[0] && this.dispFields[0].id;
    const firstDispId = firstDispName? `${this.secId}_${firstDispName}`:'';
    const secondDispName = this.dispFields && this.dispFields[1] && this.dispFields[1].id;
    const secondDispId = secondDispName? `${this.secId}_${secondDispName}`:'';
    const ThirdDispName = this.dispFields && this.dispFields[2] && this.dispFields[2].id;
    const thirdDispId = ThirdDispName? `${this.secId}_${ThirdDispName}`:'';
    this.fields.forEach(e => {
      if(firstDispId!=''){
        if(firstDispId==e.name){
          this.firstDisVal = e.value;
          this.firstDisType = e.xtype;
        }
      }
      if(secondDispId!=''){
        if(secondDispId==e.name){
          this.secondDisVal = e.value;
          this.secondDisType = e.xtype;
        }
      }
      if(thirdDispId!=''){
        if(thirdDispId==e.name){
          this.thirdDisVal = e.value;
          this.thirdDisType = e.xtype;
        }
      }
      if(!(e.hide && e.hide == true)){
        if(e.mandatory == 'Y'){
          if ((e.value == "") || (e.value == undefined)) {
            msg += e.label + ' <br/>';
            fieldError = true;
          } 
        }
      }
    });
    return { fieldError, msg };
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
  save() {
    this.commonCtrl.processShow('Processing...');
    const para = { docId: this.unid, maindocId: this.mianunid, currsecid: this.secId, fields: this.fields};
    return new Promise((resolve, reject) => {
      this.storage.get("loginDetails").then(logindata => {
        //this.getforms.getFormData(logindata, { "unid": "EBE27D0FEC6AEFF9482584D90020DCE6" }).pipe(first()).subscribe(data => {
        this.getforms.saveMicrodbDoc(logindata, para).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
          console.log('func----submit-----', data)
          this.commonCtrl.processHide();
          if(data.status == 'success'){
            this.navParams.data.modal.dismiss({
              result: 'success',
              unid: data.unid,
              firstDisVal: this.firstDisVal,
              firstDisType: this.firstDisType,
              secondDisVal: this.secondDisVal,
              secondDisType: this.secondDisType,
              thirdDisVal: this.thirdDisVal,
              thirdDisType: this.thirdDisType
            })
          }else{
            this.presentAlert("Save failed:<br/>reason:" + data.reason, "", ["OK"])
          }
          

        })
        //resolve(data)
        //})
      })
    })

  }
  //查找名称
  async getSecurity(fieldname, fieldvalue, stype: string, label) {
    const cbgcolor = this.cbgcolor;
    const modal = await this.modal.create({
      showBackdrop: true,
      component: SecurityComponent,
      componentProps: { stype, fieldvalue, label, cbgcolor }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    const field = this.fields.find(e => e.name == fieldname);
    if(field){
      field.value = data.result;
    }
    

  }
}
