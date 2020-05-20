import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
@Component({
  selector: 'app-sanner',
  templateUrl: './sanner.page.html',
  styleUrls: ['./sanner.page.scss'],
})
export class SannerPage implements OnInit {

  light: boolean;//判断闪光灯 
  frontCamera: boolean;//判断摄像头 
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿
  constructor(private qrScanner: QRScanner, public navController: NavController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        console.log('start scanning'); // start scanning 
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          alert(text);
          this.qrScanner.hide(); // hide camera preview 
          scanSub.unsubscribe(); // stop scanning 
          this.navController.back();
        });
        // 打开摄像头 this.qrScanner.show();
      } else if (status.denied) {
        console.log('没有摄像头权限，请前往设置中开启');
      } else {
        // permission was denied, but not permanently.You can ask for permission again at a later time. 
        console.log('没有摄像头权限，请前往设置中开启');
      }
    }).catch((e: any) => console.log('Error is', e));
  }
  /*页面可见后执行 */
  ionViewDidEnter() {
    this.isShow = true;//显示背景 
  }
  /** * 闪光灯控制，默认关闭 */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }
  /** * 前后摄像头互换 */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }
  hideCamera() {
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
     this.qrScanner.destroy();//关闭
  }
  ionViewWillLeave() { this.hideCamera(); }


}
