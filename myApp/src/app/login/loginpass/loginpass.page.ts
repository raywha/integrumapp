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
import { AppConfig } from '../../config';

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
              localStorage.setItem('MR', result.user.MR);
              var curtime = new Date();
              //console.log('-->starttime:', curtime.toLocaleTimeString());
              console.log('updateUserInfo--before---this.loginDetails:',this.loginDetails);
              this.auth.updateUserInfo(this.loginDetails).pipe(first()).subscribe(
                data => {
                  //console.log('updateUserInfo----data...:', data)
                  data = JSON.parse(data.data);
                  console.log('updateUserInfo data,',data);
                  const AppVersionNo = data.AppVersionNo;
                  const curVersion = AppConfig.appversion;
                  const msg = data.msg; 
                  const btnYes = data.btnYes;
                  const btnNo = data.btnNo;
                  let AppURL = data.AppURL;
                  if(AppURL!='') AppURL.replace('https','itms-apps')
                  if(AppVersionNo && AppVersionNo.includes('.')){
                    const ret  = AppVersionNo.split('.');
                    const cret = curVersion.split('.');
                    const first  = ret[0];
                    const curfir = cret[0];
                    if(curfir < first){
                      //TODO
                      this.promptOfUpdate(msg,btnYes,btnNo,AppURL);
                    }else if(curfir == first){
                      const second = ret[1];
                      const cursec = cret[1];
                      if(second.includes('.')){
                        //TODO

                      }else{
                        //console.log('cursec:',cursec, ' second:',second)
                        if( cursec < second){
                          this.promptOfUpdate(msg,btnYes,btnNo,AppURL);
                        }
                      }
                    }
                  }
                  this.loginDetails.OUCategory = data.OUCategory;
                  const EmpCurrentPortal = data.EmpCurrentPortal;
                  this.loginDetails.empgroup = EmpCurrentPortal;
                  //console.log('updateUserInfo---->this.loginDetails:', this.loginDetails)
                  localStorage.setItem('OUCategory', data.OUCategory)
                  localStorage.setItem('EmpCurrentPortal', EmpCurrentPortal)
                  console.log('userlan:', data.lan);
                  localStorage.setItem('lan', data.lan);
                  this.translate.setDefaultLang(data.lan);
                  this.translate.use(data.lan);
                  this.storage.set("loginDetails", this.loginDetails)

                  // this.getallforms.getAllForms(this.loginDetails,data.lan).pipe(first()).subscribe(data => {
                  //   this.commonCtrl.processHide();
                  //   const otime = new Date();
                  //   console.log('getAllForms--otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:', curtime.toLocaleTimeString());
                  //   data = JSON.parse(data.data);
                  //   this.storage.set('allforms', JSON.stringify(data));
                  // })

                  // this.commonCtrl.processHide();
                  // this.ngZone.run(() => {

                  //   this.router.navigate(['tabs/tab1'],{ queryParams: { lan: data.lan } })
                  // })
                  this.storage.get("allforms").then( forms => {
                    const lan = data.lan;
                   if(forms == null){
                     this.downloadAllForms(lan);
                   }else{
                     forms = JSON.parse(forms);
                     console.log('forms:', forms);
                     const templates = forms.templates;
                     // const templateids = templates.filter(t => t.lastmodify);
                     const arr = [];
                     templates.forEach(t => {
                       if (t) {
                         const lastmodify = t.lastmodify;
                         if (lastmodify) {
                           arr.push({
                             tid: t.template.templateId,
                             lastmodify
                           })
                         }
                       }
 
                     });
                     console.log('--------------arr....', arr);
                     if (arr.length == 0) {
                       this.downloadAllForms(lan);
                     } else {
                       this.getUpdateFormids(arr,lan).then(data => {
                         //console.log('getUpdateFormids---------?>',data.data)
                         data = JSON.parse(data.data);
                         console.log('getUpdateFormids---------------data:', data);
                         if (data.tmplateids) {
                           const arr = data.tmplateids;
                           if (arr.length == 0) {
                             console.log('do not need update allforms');
                             const otime = new Date();
                             console.log('getAllForms-***getUpdateFormids---do not need update allforms-otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:');
                             this.commonCtrl.processHide();
                             this.ngZone.run(() => {
         
                               this.router.navigate(['tabs/tab1'], { queryParams: { lan} })
                             })
                           } else {
                             const tarr = [];
                             for (let index = 0; index < arr.length; index++) {
                               const element = arr[index];
                               tarr.push(this.getForm(element,lan));
                             }
                             Promise.all(tarr).then(result => {
                               console.log('----**----===----result:', result);
                               let newtemplates: any = templates;
                               arr.forEach(f => {
                                 newtemplates = newtemplates.filter(form => form.template.templateId != f)
                               });
                               newtemplates = newtemplates.concat(result);
                               this.storage.set('allforms', JSON.stringify({ templates: newtemplates }));
                               const otime = new Date();
                             console.log('getAllForms-***getUpdateFormids---update specify forms-otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:');
                               this.commonCtrl.processHide();
                               this.ngZone.run(() => {
           
                                 this.router.navigate(['tabs/tab1'], { queryParams: { lan } })
                               })
                             }).catch(e => {
                               console.log('getform all error:', e);
                             })
                           }
                         } else {
                           if (data.status != 'failed') {
                             console.log('----------------------allforms:', data);
                             this.storage.set('allforms', JSON.stringify(data));
                             this.commonCtrl.processHide();
                             this.ngZone.run(() => {
         
                               this.router.navigate(['tabs/tab1'], { queryParams: { lan } })
                             })
                           }else{
                             console.log('getUpdateFormids error:',data)
                           }
 
                         }
                       });
                     }
                   }
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
                this.presentAlert(this.resmsg, res.title, [res.btn]);
              }));
            }
          } else {
            this.commonCtrl.processHide();
            //this.presentAlert("密码错误！");
            this.translate.get('login').subscribe((res: any) => {
              this.resmsg = res.authpasserr;
            }).add(this.translate.get('alert').subscribe((res: any) => {
              this.presentAlert(this.resmsg, res.title, [res.btn]);
            }));
          }
        },
      );
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
  ssoLogin(){
    
    
    let browserURL = this.ssoserver + '/' + this.ssofolder + '/' + 'integrumws.nsf/ssordnew.xsp';
    //console.log('browserURL:',browserURL)
    Plugins.Browser.open({
      url: browserURL
    });
  }
  ssoAuth(data: any) {
    let newURL = data.url.split('?');
    let newkey = newURL[1].split('&');

    this.key1 = newkey[0].split('=');
    this.key2 = newkey[1].split('=');
   // console.log('------key1------', this.key1);
    //console.log('------key2------', this.key2);
    let postData = { key1: this.key1[1], key2: this.key2[1] };
    //console.log("POSTDATA>>>", postData);

    
    this.auth.ssoData(this.ssoserver, this.ssofolder, postData).subscribe(d => {
      d = JSON.parse(d.data)
      if (d.result == "false") {
        //this.presentAlert('Login Failed!<br/>Please contact your administrator.', 'Error', ['OK']);

      }
      else {
       // console.log('success....', d);
        this.Login();
        //this.saveLoginDetails(loginDetails);p@ssw0rd
      }


    },
      error => {
        // browser.close();
        this.presentAlert('Login Failed 123!', 'integrumNOW Error', ['OK']);

      });
  }
  promptOfUpdate(msg: any,btnYes: string, btnNo: string, url: string){
    this.presentAlert(msg,'',[
      {text:btnNo, handler:()=>{}},
      {text:btnYes,handler:()=>{
        //console.log('prompt of update///');
        Plugins.Browser.open({url});
      }}
    ]);
  }
  getForm(tmpid: string, lan: string){
    return new Promise((resolve,reject)=>{
      this.getallforms.getSpecifyForm(this.loginDetails,tmpid,lan).pipe(first()).subscribe(data => {
        console.log('getForm data:',data);
        //this.storage.set('tmpid',data)
        data = JSON.parse(data.data);
        //resolve(JSON.stringify(data));
        resolve(data);
       });
    })
  }
  getFormids( lan: string):any{
    return new Promise((resolve,reject)=>{
      this.getallforms.getFormids(this.loginDetails,lan).pipe(first()).subscribe(data => {
        console.log('getFormids data:',data);
        //this.storage.set('tmpid',data)
        resolve(data);
       });
    })
  }
  getUpdateFormids(param: any,lan:string):any{
    return new Promise((resolve,reject)=>{
      this.getallforms.getUpdateFormids(this.loginDetails,param,lan).pipe(first()).subscribe(data => {
        console.log('getUpdateFormids data:',data);
        //this.storage.set('tmpid',data)
        
        resolve(data);
       });
    })
  }
  downloadAllForms(lan: string){
    this.getFormids(lan).then( data =>{
      data = JSON.parse(data.data);
      if(data.tmplateids){
        const arr = data.tmplateids;
        const tarr = [];
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          tarr.push(this.getForm(element,lan));
        }
        Promise.all(tarr).then(result => {
          console.log('------------result:', result)
          this.storage.set('allforms', JSON.stringify({templates:result})); 
          const otime = new Date();
                    console.log('getAllForms-***downloadAllForms-otime.toLocaleTimeString:', otime.toLocaleTimeString(), '-->starttime:');
          this.commonCtrl.processHide();
          this.ngZone.run(() => {

            this.router.navigate(['tabs/tab1'], { queryParams: { lan } })
          })
        }).catch(e => {
          console.log('getform all error:', e);
        })
      }else{
        if(data.status != 'failed'){
          console.log('----------------------allforms:',data);
          this.storage.set('allforms', JSON.stringify(data)); 
          this.commonCtrl.processHide();
          this.ngZone.run(() => {

            this.router.navigate(['tabs/tab1'], { queryParams: { lan } })
          })
        }else{
          console.log('downloadAllForms error:',data)
        }
        
      }
    });
  }
}
