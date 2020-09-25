import { Component, OnInit } from '@angular/core';
import { AlertController,NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GetallformsService } from "../../services/getallforms.service";
import { first, catchError } from 'rxjs/operators';
import { commonCtrl } from "../../common/common";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})
export class OfflinePage implements OnInit {
  public offlineFlag: boolean = false;
  constructor(
    private storage: Storage,
    private getforms: GetallformsService,
    public alertController: AlertController,
    public nav: NavController,
    private commonCtrl: commonCtrl) {
    if (localStorage.getItem('offlineFlag')) {
      this.offlineFlag = localStorage.getItem('offlineFlag') == "false" ? false : true;
    } else {
      this.offlineFlag = false;
      localStorage.setItem('offlineFlag', this.offlineFlag + '');
    }
  }

  ngOnInit() {
  }
  changeOffline() {
    localStorage.setItem('offlineFlag', this.offlineFlag + '');
  }
  gotoHomePage(){
    if(this.offlineFlag){
      this.async();
    }else{
      this.nav.navigateBack('/tabs/tab1');
    }
  }
  async() {
    console.log("---in async doc----");
    const allTemplateID: any = localStorage.getItem('allTemplateID');
    if (!allTemplateID) {
      console.log('no data!');
      this.nav.navigateBack('/tabs/tab1');
      //this.presentAlert("There is no data needs to be synchronized.", "",['Ok']);
    } else {
      this.storage.get("loginDetails").then(logindata => {
        this.getforms.isOnline(logindata).pipe(first()).subscribe(result => {

          result = JSON.parse(result.data);
          if (result.returnResponse == "Success") {
            this.commonCtrl.processShow("data transferring ...");
            const templateIDs: any = JSON.parse(allTemplateID);
            const allData: any = [];
            for (let index = 0; index < templateIDs.length; index++) {
              const templateID = templateIDs[index];
              if(localStorage.getItem(templateID)){
                const docs: any = JSON.parse(localStorage.getItem(templateID));
                const docnames: any = [];
                for (let i = 0; i < docs.length; i++) {
                  const doc = docs[i];
                  if(doc.name){
                    // this.storage.get(doc.name).then(d => {
                    //   console.log(doc.name, ' --data:', JSON.parse(d));
                    // })
                    allData.push(this.storage.get(doc.name))
                  }
                }
              }
            }
            // templateIDs.forEach(e => {
            //   this.storage.get(e).then(d => {
            //     console.log(e, ' --data:', JSON.parse(d));
            //   })
            //   allData.push(this.storage.get(e))
            // });          
            Promise.all(allData).then((values) => {
              values.forEach((val: string, index) => {
                values[index] = JSON.parse(val);
              })
              console.log("------val-----", values);
              this.getforms.syncSave(logindata, values).pipe(first()).subscribe(data => {
                console.log('success');

                for (let index = 0; index < templateIDs.length; index++) {
                  const templateID = templateIDs[index];                
                  if(localStorage.getItem(templateID)){
                    const docs: any = JSON.parse(localStorage.getItem(templateID));
                    const docnames: any = [];
                    for (let i = 0; i < docs.length; i++) {
                      const doc = docs[i];
                      if(doc.name){                      
                        this.storage.remove(doc.name);
                      }
                    }
                    localStorage.removeItem(templateID);
                  }
                }
                localStorage.removeItem("allTemplateID");

                this.commonCtrl.processHide();
                this.storage.get('offlinemuitldata').then(d => {
                  d = JSON.parse(d);
                  this.presentAlert(`${d.online.syncEnd}`, "", [{
                    text: 'Ok',
                    handler: () => {
                      this.nav.navigateBack('/tabs/tab1');
                    }
                  }]);
                })         
              }, error => {
                console.log('had error: ', error);
                this.commonCtrl.processHide();
                console.log('status:', error.status);
                this.nav.navigateBack('/tabs/tab1');
              })
            }).catch(
              e => {
                console.log("---promise all error---", e);
                this.commonCtrl.processHide();
                this.nav.navigateBack('/tabs/tab1');
              }
            );
          } else if (result.returnResponse == "offline") {
            this.storage.get('offlinemuitldata').then( d => {
              d = JSON.parse(d);
              this.presentAlert(`${d.online.offlineTip}`, "", [{
                text: 'Ok',
                handler: () => {
                  this.offlineFlag = true;
                  localStorage.setItem('offlineFlag', this.offlineFlag + '');
                  this.nav.navigateBack('/tabs/tab1');
                }
              }]);
            })    
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
