import { Component,ViewChild } from '@angular/core';
//import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignaturePad } from 'angular2-signaturepad';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopoverController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';


/**
 * Generated class for the SignaturepadPopover page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-signaturepad-popover',
  templateUrl: 'signaturepad-popover.html',
})
export class SignaturepadPopover {

  isDrawing = false;

  //@ViewChild(SignaturePad,{static:true}) signaturePad: SignaturePad;
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  private signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public Popover: PopoverController,private sanitizer : DomSanitizer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignaturepadPopover');
  }
  drawComplete() {
    this.isDrawing = false;
  };

  drawStart() {
    this.isDrawing = true;
  };
  savePad() {
    console.log(this.signaturePad);
    let signature = this.signaturePad.toDataURL();
    this.Popover.dismiss(signature);

  }


  clearPad() {
    this.signaturePad.clear();
  }
}
