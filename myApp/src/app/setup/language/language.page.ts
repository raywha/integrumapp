import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular'; 
@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  public langularArr:any=[];
  public lan:string='';
  public name:string;
  public selectPortalIndex: number = 0;
  constructor(public translate :TranslateService,public activeRoute: ActivatedRoute,public router:Router, public nav:NavController, public http:HttpClient, private storage:Storage) { 
    // this.translate.setDefaultLang('zh');
    this.activeRoute.queryParams.subscribe(res => {
      console.log('res:',res)
      if (res.selectPortalIndex) {
        this.selectPortalIndex = res.selectPortalIndex
      }
    });
  }

  ngOnInit() {
    // this.user=localStorage.getItem('user');
    this.storage.get("apptranslation").then(data=>{
      data = JSON.parse(data)
      this.langularArr=data.Languages;
      const browerLang=this.translate.getDefaultLang();
      this.lan=browerLang;
    })
    
    
  }
  radioCheck(item){
    console.log(this.lan)
    console.log(item.SelectedLanguages)
    this.translate.setDefaultLang(item.SelectedLanguages)
    this.translate.use(item.SelectedLanguages);
    
  }
  goBack(){
    // this.nav.back()
    　//this.router.navigate(['tabs/tab1'],{ queryParams: { selectlan: this.selectlan } })
    this.nav.navigateBack('/tabs/tab1',{queryParams:{selectPortalIndex:this.selectPortalIndex}});
   }
}
