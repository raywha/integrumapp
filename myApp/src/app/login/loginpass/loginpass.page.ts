import { Component, OnInit ,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GetousService } from "../../services/getous.service";
import { GetpersoninfoService } from "../../services/getpersoninfo.service";
import { TranslateService } from '@ngx-translate/core';
import { GetallformsService } from "../../services/getallforms.service";
import { commonCtrl } from "../../common/common";

@Component({
  selector: 'app-loginpass',
  templateUrl: './loginpass.page.html',
  styleUrls: ['./loginpass.page.scss'],
})
export class LoginpassPage implements OnInit {
  public user: string;
  public pass: string;
  public code: string;
  public resmsg: string;
  public loginDetails ={
    email:"",
    code:"",
    OUCategory:"",
    server:"",
    folder:"",
    username:"",
    password:"",
    empgroup:""
  }
  public logPic = {
    log: "/assets/icon/logo.png",
    background: "/assets/icon/loginpass.png"
  }
  public server: string;
  public folder: string;
  public key1:string = "";
  public key2:string = "";
  public ssoserver;
  public ssofolder;
  constructor(
    public alertController: AlertController,
    private auth: AuthenticationService,
    private router: Router,
    private storage: Storage,
    private getou: GetousService,
    private getpsn: GetpersoninfoService,
    private translate: TranslateService,
    private getallforms: GetallformsService,
    public commonCtrl: commonCtrl,
    public ngZone: NgZone
  ) {
    this.ssoserver = localStorage.getItem('ssoserver');
    this.ssofolder = localStorage.getItem('ssofolder');

  }



  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.storage.get("loginDetails").then(data => {
      if (data) {

        this.loginDetails.email = data.email
        this.loginDetails.OUCategory = data.OUCategory
        this.pass = data.password
        this.server = data.server;
        this.folder = data.folder;
        this.code = data.code;
        this.getou.getLoginPic(data).pipe(first()).subscribe(data => {
          data = JSON.parse(data.data);
         this.logPic.log=data.LoginCompanyLogo
         this.logPic.background=data.LoginBKImage
        });
      } else {
        this.loginDetails.email = localStorage.getItem('email')
        this.loginDetails.OUCategory = localStorage.getItem('OUCategory')
        this.server = localStorage.getItem('server');
        this.folder = localStorage.getItem('folder');
      }

    })



  }

  //log in system
  Login() {
    this.commonCtrl.processShow('Processing...');

    this.auth.login(this.user, this.pass, this.server, this.folder)
      .pipe(first())
      .subscribe(
        result => {
          if (result.data.indexOf('DOCTYPE') == -1) {
            result = JSON.parse(result.data)
            if (result.returnResponse == "Success") {
              this.loginDetails.username = this.user;
              this.loginDetails.password = this.pass;
              this.loginDetails.server = this.server;
              this.loginDetails.folder = this.folder;
              this.loginDetails.code = this.code;
              this.loginDetails.email = result.user.email;
              this.loginDetails.OUCategory = result.user.oucategory;

              this.storage.set("loginDetails",this.loginDetails)
              this.auth.updateUserInfo(this.loginDetails).pipe(first()).subscribe(
                data => {
                  data = JSON.parse(data.data);
                  this.loginDetails.OUCategory = data.OUCategory;
                  const EmpCurrentPortal = data.EmpCurrentPortal;
                  this.loginDetails.empgroup = EmpCurrentPortal;
                  console.log('updateUserInfo---->this.loginDetails:',this.loginDetails)
                  localStorage.setItem('EmpCurrentPortal',EmpCurrentPortal)
                  this.storage.set("loginDetails",this.loginDetails)
                }
              )
              this.getou.getous(this.user, this.pass, this.server, this.folder).pipe(first()).subscribe(
                data => {
                  data = JSON.parse(data.data);
                  this.storage.set('ous', JSON.stringify(data));
                }
              )
              this.getpsn.getpersoninfo(this.user, this.pass, this.server, this.folder).pipe(first()).subscribe(
                data => {
                  data = JSON.parse(data.data);
                  this.storage.set('psninfo', JSON.stringify(data));
                }
              )
              this.getallforms.getAllForms(this.loginDetails).pipe(first()).subscribe(data => {
                // console.log("forms信息"+JSON.stringify(data))
                data = JSON.parse(data.data);
                this.storage.set('allforms', JSON.stringify(data));
              })
              this.commonCtrl.processHide();
              this.ngZone.run(()=>{
                this.router.navigate(['tabs/tab1']);

              })

            } else {
              this.commonCtrl.processHide();
              //this.presentAlert("密码错误！");
              this.translate.get('login').subscribe((res: any) => {
                this.resmsg = res.authpasserr;
              }).add(this.translate.get('alert').subscribe((res: any) => {
                this.presentAlert(this.resmsg, res.title, res.btn);
              }));
            }
          } else {
            this.commonCtrl.processHide();
            //this.presentAlert("密码错误！");
            this.translate.get('login').subscribe((res: any) => {
              this.resmsg = res.authpasserr;
            }).add(this.translate.get('alert').subscribe((res: any) => {
              this.presentAlert(this.resmsg, res.title, res.btn);
            }));
          }
        },
      );
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
  ssoLogin(){
    
    
    let browserURL = this.ssoserver + '/' + this.ssofolder + '/' + 'integrumws.nsf/ssord.xsp';
    console.log('browserURL:',browserURL)
    //let browserURL = this.ssoserver + '/' + 'integrumws.nsf/ssord.xsp';
    //const browser = this.iab.create(browserURL, '_blank', 'location=yes,toolbar=yes');
    //let codes="if(typeof getCodes == 'function') {getCodes()};";
    //this.SSOExcuteScript(codes,browser); //end of sso code
  }
  SSOExcuteScript(codes, browser) {

    //if (browser.on('loadstart').subscribe)
    browser.on('loadstart').subscribe(e => {
      this.key1 = "";
      this.key2 = "";
      if (e && e.url)

        if (e.url.includes('key1')) {

          let newURL = e.url.split('?');
          let newkey = newURL[1].split('&');

          this.key1 = newkey[0].split('=');
          this.key2 = newkey[1].split('=');

        }
        else {
          console.log("no key FOUND");
        }
    });

    browser.on("loadstop").subscribe(r => {
      browser.executeScript({ code: codes }).then(data => {
        if (this.key1[1]) {
          browser.close();
          // let postData={key1:data[0].key1,key2:data[0].key2};
          let postData = { key1: this.key1[1], key2: this.key2[1] };
          console.log("POSTDATA>>>", postData);
          
          this.auth.ssoData(this.ssoserver, this.ssofolder, postData).subscribe(d => {
            d = JSON.parse(d.data)
            if (d.result == "false") {
              this.presentAlert( 'Login Failed!<br/>Please contact your administrator.','integrumNOW Error','OK');
              browser.close();
            }
            else {
              console.log('success....',d);
              this.Login();
              //this.saveLoginDetails(loginDetails);p@ssw0rd
            }


          },
            error => {
              // browser.close();
              this.presentAlert( 'Login Failed 123!','integrumNOW Error','OK');

            });
        }
        else {
          console.log("SSO LOGIN ISSUE CHECK else condition ");
        }
      });

    });

  };
}
