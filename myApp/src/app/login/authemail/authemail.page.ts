import { Component, OnInit ,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService} from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { AlertController,NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormControl, FormGroup, Validators ,FormBuilder} from '@angular/forms'; 
import { GetousService } from "../../services/getous.service";
import { GetpersoninfoService } from "../../services/getpersoninfo.service";
import { TranslateService } from '@ngx-translate/core';
import { GetallformsService } from "../../services/getallforms.service";
import { commonCtrl } from "../../common/common";
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-authemail',
  templateUrl: './authemail.page.html',
  styleUrls: ['./authemail.page.scss'],
})
export class AuthemailPage implements OnInit {

  public email: any;
  public code: any ;
  public sendStat:Boolean;
  public year:string ;
  public user:string ;
  public pass: string ;
  public authform : FormGroup;
  public resmsg:string;
  public name:any;
  public password:any;
  public sso:boolean = false;
  public ssoserver:any;
  public ssoserverlist:any = [];
  public ssofolderlist:any = [];
  public server:string;
  public folder:string;
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
  public key1:string = "";
  public key2:string = "";
  constructor(public  alertController:AlertController,private auth: AuthenticationService,private router: Router
    ,private storage:Storage,
    private formBuilder: FormBuilder,
    private getou:GetousService,
    private getpsn:GetpersoninfoService,
    private translate:TranslateService,
    private getallforms:GetallformsService,
    public navCtrl:NavController,
    public commonCtrl: commonCtrl,
    public ngZone:NgZone,
    ) {
      this.authform = formBuilder.group({
        code: ['', Validators.required],
        name: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([ Validators.required])],      
      });
      this.email = this.authform.controls['email']
      this.code = this.authform.controls['code'];
      this.name= this.authform.controls['name'];
      this.password= this.authform.controls['password'];

      Plugins.Browser.addListener("browserPageLoaded", (e:any)=>{
        console.log("-------in pageload-------");
        console.log("-----e------",e);
        this.key1 = "";
        this.key2 = "";
        if (e && e.url)
          if (e.url.includes('key1')) {
  
            let newURL = e.url.split('?');
            let newkey = newURL[1].split('&');
  
            this.key1 = newkey[0].split('=');
            this.key2 = newkey[1].split('=');
            console.log('------key1------',this.key1);
            console.log('------key2------',this.key2);
          }
          else {
            console.log("no key FOUND");
          }
      });
      Plugins.Browser.addListener("browserFinished", data=>{
        {
          console.log("-------in pagefinished-------");
          if (this.key1[1]) {
            Plugins.Browser.close();
            // let postData={key1:data[0].key1,key2:data[0].key2};
            let postData = { key1: this.key1[1], key2: this.key2[1] };
            console.log("POSTDATA>>>", postData);
            this.Login();
            
          }
          else {
            console.log("SSO LOGIN ISSUE CHECK else condition ");
          }
        }
      });
     }

  ngOnInit() {
    this.sendStat=true;
    this.year = new Date().getFullYear().toString();
  }
 
  SendEmail(){
    if (!this.sso) {
      this.auth.sendEmail(this.authform.value.code)
      .pipe(first())
      .subscribe(
        result => 
        {
          result=JSON.parse(result.data)
          console.log("SendEmail-->result:",result)
          if(result.status!="fail"){
            this.sendStat=true;
            //this.router.navigate(['loginpass'])
            this.user=this.authform.value.name
            this.pass=this.authform.value.password
            this.code = this.authform.value.code;
            this.server=result.server
            this.folder=result.folder

            this.loginDetails.username = this.user;
            this.loginDetails.password = this.pass;
            this.loginDetails.server = this.server;
            this.loginDetails.folder = this.folder;
            this.loginDetails.code = this.code;

            this.storage.set("loginDetails",this.loginDetails)
           
            this.Login();
          }else{
             this.translate.get('login').subscribe((res: any) => {
             this.resmsg=res.authmailerr;
          }).add(this.translate.get('alert').subscribe((res: any) => {
              this.presentAlert( this.resmsg,res.title,res.btn);
          }));
           
          }
        }
      );
    } else {
      this.ssologin();
    }
    

  }
  Login() {
   this.commonCtrl.processShow('Processing...');

    this.auth.login(this.user, this.pass, this.server, this.folder)
      .pipe(first())
      .subscribe(
        result => {
          if (result.data.indexOf('DOCTYPE') == -1) {
            result = JSON.parse(result.data)
            this.commonCtrl.processShow('Processing...');
            if (result.returnResponse == "Success") {
              this.user = result.user.username;
              this.loginDetails.username = this.user;
              //this.loginDetails.password = this.pass;
              this.loginDetails.server = this.server;
              this.loginDetails.folder = this.folder;
              this.loginDetails.code = this.authform.value.code;
              this.loginDetails.email = result.user.email;
              localStorage.setItem('email',result.user.email)
              this.loginDetails.OUCategory = result.user.oucategory;

              this.storage.set("loginDetails",this.loginDetails);

              localStorage.setItem('bgcolor',result.color);
              this.auth.updateUserInfo(this.loginDetails).pipe(first()).subscribe(
                data => {
                  console.log('updateUserInfo----data...:',data)
                  data = JSON.parse(data.data);
                  this.loginDetails.OUCategory = data.OUCategory;
                  const EmpCurrentPortal = data.EmpCurrentPortal;
                  this.loginDetails.empgroup = EmpCurrentPortal;
                  console.log('updateUserInfo---->this.loginDetails:',this.loginDetails)
                  localStorage.setItem('OUCategory',data.OUCategory)
                  localStorage.setItem('EmpCurrentPortal',EmpCurrentPortal)
                  console.log('userlan:',data.lan);
                  localStorage.setItem('lan',data.lan);
                  this.translate.setDefaultLang(data.lan);
                  this.translate.use(data.lan);
                  this.storage.set("loginDetails",this.loginDetails)
                }
              )
              var curtime = new Date();
              console.log('-->starttime:',curtime.toLocaleTimeString());
              localStorage.setItem('hasLogged','true');
              localStorage.setItem('user',this.user);
              localStorage.setItem('OUCategory',result.user.oucategory)
              this.getou.getous(this.user, this.pass, this.server, this.folder).pipe(first()).subscribe(
                data => {
                  const otime = new Date();
                  console.log('getous--otime.toLocaleTimeString:',otime.toLocaleTimeString(),'-->starttime:',curtime.toLocaleTimeString());
                  data = JSON.parse(data.data);
                  this.storage.set('ous', JSON.stringify(data));
                }
              )
              this.getpsn.getpersoninfo(this.user, this.pass, this.server, this.folder).pipe(first()).subscribe(
                data => {
                  const otime = new Date();
                  console.log('getpersoninfo--otime.toLocaleTimeString:',otime.toLocaleTimeString(),'-->starttime:',curtime.toLocaleTimeString());
                  data = JSON.parse(data.data);
                  this.storage.set('psninfo', JSON.stringify(data));
                }
              )
              this.getallforms.getAllForms(this.loginDetails).pipe(first()).subscribe(data => {
                this.commonCtrl.processHide();
                const otime = new Date();
                  console.log('getAllForms--otime.toLocaleTimeString:',otime.toLocaleTimeString(),'-->starttime:',curtime.toLocaleTimeString());
                data = JSON.parse(data.data);
                this.storage.set('allforms', JSON.stringify(data));
              })
              this.commonCtrl.processHide();
              this.ngZone.run(()=>{
                
                this.router.navigate(['tabs/tab1'])
              })  
            } else {
              this.commonCtrl.processHide();
              //this.presentAlert("password error！");
              this.translate.get('login').subscribe((res: any) => {
                this.resmsg = res.authpasserr;
              }).add(this.translate.get('alert').subscribe((res: any) => {
                this.presentAlert(this.resmsg, res.title, res.btn);
              }));
            }
          } else {
            this.commonCtrl.processHide();
            //this.presentAlert("password error！");
            this.translate.get('login').subscribe((res: any) => {
              this.resmsg = res.authpasserr;
            }).add(this.translate.get('alert').subscribe((res: any) => {
              this.presentAlert(this.resmsg, res.title, res.btn);
            }));
          }
        },
      );
  }
  // 
  async presentAlert(msg:string,header:string,btn:string) {

    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: msg,
      buttons: [btn]
    });

    await alert.present();
  }
  onchange(){
  
    if(this.authform.value.code=='') this.sso = false;
  }
  ssoToggle(){
    console.log('*******************this.authform:',this.authform)
    if(this.sso){
      this.commonCtrl.processShow('Processing...');
      
      console.log('------->this.authform:',this.authform)
      this.auth.sendEmail(this.authform.value.code)
      .pipe(first())
      .subscribe(
        result => 
        {
          this.commonCtrl.processHide();

          result = JSON.parse(result.data);
          console.log('SendEmail--result:',result)
          if(result.status!="fail"){
            this.authform = this.formBuilder.group({
              code: [this.authform.value.code, Validators.required],
              name: [this.authform.value.name],
              password: [this.authform.value.password]
            });

            this.ssoserverlist=result.SSOServer;
            this.ssofolderlist=result.SSOFolder;
            this.server = result.server;
            this.folder = result.folder;
            this.loginDetails.server = this.server;
            this.loginDetails.folder = this.folder;
            this.loginDetails.code = this.authform.value.code

            this.storage.set("loginDetails",this.loginDetails)
          }else{
             this.translate.get('login').subscribe((res: any) => {
             this.resmsg=res.authmailerr;
          }).add(this.translate.get('alert').subscribe((res: any) => {
            this.sso = false;
              this.presentAlert( this.resmsg,res.title,res.btn);
          }));
           
          }
        }
      );
    }else{
      this.authform = this.formBuilder.group({
        code: [this.authform.value.code, Validators.required],
        name: [this.authform.value.name, Validators.compose([Validators.required])],
        password: [this.authform.value.password, Validators.compose([ Validators.required])]
      });
    }
    this.code = this.authform.controls['code'];
    this.name= this.authform.controls['name'];
    this.password= this.authform.controls['password'];
  }
  ssologin(){
    if(!this.ssoserver){
      //this.presentAlert( 'this.resmsg','','ok');
      return false;
    }
    const index:number = this.ssoserverlist.indexOf(this.ssoserver);
    const ssofolder:string = this.ssofolderlist[index];
    localStorage.setItem('ssoserver',this.ssoserver);
    localStorage.setItem('ssofolder',ssofolder);
    //let browserURL = this.ssoserver + '/' + ssofolder + '/' + 'integrumws.nsf/ssord.xsp';
    let browserURL = this.ssoserver + '/' + ssofolder + '/' + 'azure.nsf/OAuth?openpage';
    console.log('browserURL:',browserURL)
    //let browserURL = this.ssoserver + '/' + 'integrumws.nsf/ssord.xsp';

    //const browser = this.iab.create(browserURL, '_blank', 'location=yes,toolbar=yes');
    const { Browser } = Plugins;
    //let codes="if(typeof getCodes == 'function') {getCodes()};";
    Plugins.Browser.open({
      url: browserURL,
      toolbarColor: "#5A5DF5"
    });
    //this.SSOExcuteScript(codes,Browser,browserURL); //end of sso code
  }
  async SSOExcuteScript(codes, Browser,browserURL) {
    await Browser.open({ url: browserURL });
    Browser.addListener("browserPageLoaded", (e:any)=>{
      console.log("-------in pageload-------");
      console.log("-----e------",e);
      this.key1 = "";
      this.key2 = "";
      if (e && e.url)
        if (e.url.includes('key1')) {

          let newURL = e.url.split('?');
          let newkey = newURL[1].split('&');

          this.key1 = newkey[0].split('=');
          this.key2 = newkey[1].split('=');
          console.log('------key1------',this.key1);
          console.log('------key2------',this.key2);
        }
        else {
          console.log("no key FOUND");
        }
    });
    Browser.addListener("browserFinished", data=>{
      {
        console.log("-------in pagefinished-------");
        if (this.key1[1]) {
          Browser.close();
          // let postData={key1:data[0].key1,key2:data[0].key2};
          let postData = { key1: this.key1[1], key2: this.key2[1] };
          console.log("POSTDATA>>>", postData);
          this.Login();
          /*
          const index:number = this.ssoserverlist.indexOf(this.ssoserver);
          const ssofolder:string = this.ssofolderlist[index];
          this.auth.ssoData(this.ssoserver, ssofolder, postData).subscribe(d => {
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
            */
        }
        else {
          console.log("SSO LOGIN ISSUE CHECK else condition ");
        }
      }
    });
    

  };
  btnValid(){
    if(!this.sso) return !this.authform.valid;
    if(!this.authform.valid) return !this.authform.valid;
    if(this.ssoserver && this.ssoserver != '') return false;
    return true;
  }
}