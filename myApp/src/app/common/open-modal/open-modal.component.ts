import { Component, OnInit } from '@angular/core';
import { NavParams,AlertController } from '@ionic/angular';
@Component({
  selector: 'app-open-modal',
  templateUrl: './open-modal.component.html',
  styleUrls: ['./open-modal.component.scss'],
})
export class OpenModalComponent implements OnInit {
  public reason: string;
  public title :string ;
  constructor(
    public navParams: NavParams,
    public alertController: AlertController
  ) { 
   this.title="Please enter comments"

  }

  ngOnInit() {}

  dismiss(stype:string) {
    let result:string = "cancel";
    if(stype=='ok'){
      if(!this.reason || this.reason.trim()==''){
        this.presentAlert(this.title, "", "OK")
        return false;
      }
      result = this.reason;
    }
    
    this.navParams.data.modal.dismiss({
      data:result
    })
  }
  async presentAlert(msg: string, header: string, btn: string) {

    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: msg,
      buttons: [btn]
    });

    await alert.present();
  }

}
