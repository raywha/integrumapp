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
import { Plugins } from '@capacitor/core';

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

    Plugins.App.addListener('appUrlOpen', (data: any) => {
      console.log('---backfrombrowser', data)
      Plugins.Browser.close();
      if (data.url)
        if (data.url.includes('key1')) {
          this.ssoAuth(data);
        }
        else {
          console.log("no key FOUND");
        }
    });
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
              localStorage.setItem('bgcolor', result.color);
              
              var curtime = new Date();
              console.log('-->starttime:', curtime.toLocaleTimeString());

              this.auth.updateUserInfo(this.loginDetails).pipe(first()).subscribe(
                data => {
                  console.log('updateUserInfo----data...:', data)
                  data = JSON.parse(data.data);
                  this.loginDetails.OUCategory = data.OUCategory;
                  const EmpCurrentPortal = data.EmpCurrentPortal;
                  this.loginDetails.empgroup = EmpCurrentPortal;
                  console.log('updateUserInfo---->this.loginDetails:', this.loginDetails)
                  localStorage.setItem('OUCategory', data.OUCategory)
                  localStorage.setItem('EmpCurrentPortal', EmpCurrentPortal)
                  console.log('userlan:', data.lan);
                  localStorage.setItem('lan', data.lan);
                  this.translate.setDefaultLang(data.lan);
                  this.translate.use(data.lan);
                  this.storage.set("loginDetails", this.loginDetails)

                  this.getallforms.getAllForms(this.loginDetails,data.lan).pipe(first()).subscribe(data => {
                    this.commonCtrl.processHide();
                    const otime = new Date();
                    console.log('getAllForms--otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:', curtime.toLocaleTimeString());
                    data = JSON.parse(data.data);
                    this.storage.set('allforms', JSON.stringify(data));
                  })

                  this.commonCtrl.processHide();
                  this.ngZone.run(() => {

                    this.router.navigate(['tabs/tab1'],{ queryParams: { lan: data.lan } })
                  })
                }
              )
              
              localStorage.setItem('hasLogged', 'true');
              localStorage.setItem('user', this.user);
              localStorage.setItem('OUCategory', result.user.oucategory)
              this.getou.getous(this.user, this.pass, this.server, this.folder).pipe(first()).subscribe(
                data => {
                  const otime = new Date();
                  console.log('getous--otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:', curtime.toLocaleTimeString());
                  data = JSON.parse(data.data);
                  this.storage.set('ous', JSON.stringify(data));
                }
              )
              this.getpsn.getpersoninfo(this.user, this.pass, this.server, this.folder).pipe(first()).subscribe(
                data => {
                  const otime = new Date();
                  console.log('getpersoninfo--otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:', curtime.toLocaleTimeString());
                  data = JSON.parse(data.data);
                  this.storage.set('psninfo', JSON.stringify(data));
                }
              )

            } else {
              this.commonCtrl.processHide();
              //this.presentAlert("密码错误！");
              this.translate.get('login').subscribe((res: any) => {
                this.resmsg = res.authpasserr
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
    
    
    let browserURL = this.ssoserver + '/' + this.ssofolder + '/' + 'integrumws.nsf/ssordnew.xsp';
    console.log('browserURL:',browserURL)
    Plugins.Browser.open({
      url: browserURL
    });
  }
  ssoAuth(data: any) {
    let newURL = data.url.split('?');
    let newkey = newURL[1].split('&');

    this.key1 = newkey[0].split('=');
    this.key2 = newkey[1].split('=');
    console.log('------key1------', this.key1);
    console.log('------key2------', this.key2);
    let postData = { key1: this.key1[1], key2: this.key2[1] };
    console.log("POSTDATA>>>", postData);

    
    this.auth.ssoData(this.ssoserver, this.ssofolder, postData).subscribe(d => {
      d = JSON.parse(d.data)
      if (d.result == "false") {
        this.presentAlert('Login Failed!<br/>Please contact your administrator.', 'integrumNOW Error', 'OK');

      }
      else {
        console.log('success....', d);
        this.Login();
        //this.saveLoginDetails(loginDetails);p@ssw0rd
      }


    },
      error => {
        // browser.close();
        this.presentAlert('Login Failed 123!', 'integrumNOW Error', 'OK');

      });
  }
  
}
