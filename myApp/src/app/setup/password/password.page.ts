import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  public currentPass:string;
  public newPassword:string;
  public confirmPassword:string;
  constructor(public toastCtrl: ToastController) { }

  ngOnInit() {
    this.currentPass='';
    this.newPassword='';
    this.confirmPassword='';
  }
  async toastTip(message: string) {
    const toast = await this.toastCtrl.create({
        message: message,
        color:'dark',
        duration: 2000,
        position: 'middle',
        // showCloseButton:true
      });
    toast.present();
  }
  setPass(){
    if(!this.currentPass){
      this.toastTip('Current Password blank field');
      // return;
    }else{
      this.toastTip('Incorrect current password');
      // return;
    }
    if(!this.newPassword){
      this.toastTip('New Password blank field');
      return;
    }else{
      let patrn=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/;
      if(!patrn.test(this.newPassword)){
        this.toastTip("New password doesn't meet requirement of password policy");
        return;
      }
    }
    if(!this.confirmPassword){
      this.toastTip('Comfirm Password blank field');
      return;
    }else if(this.confirmPassword !== this.newPassword){
      this.toastTip("New and re-enter password doesn't match");
      return;
    }
    // this.dataService.accountLogin(this.passoword, this.newPassword, this.confirmPassword).subscribe(res => {
     
        // this.storageService.setStore('userId', res.user_id);
        // this.appService.userInfoEvent.emit('update');
        // this.location.back();
    // });
  }
}
