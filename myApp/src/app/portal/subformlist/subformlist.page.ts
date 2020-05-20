import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-subformlist',
  templateUrl: './subformlist.page.html',
  styleUrls: ['./subformlist.page.scss'],
})
export class SubformlistPage implements OnInit {
  public atitle:any =[];
  public aids:any = [];
  constructor(public nav:NavController,public router:Router,public storage:Storage) { }

  ngOnInit() {
    
    let aid = decodeURIComponent(this.getQueryVariable(this.router.url,'aid')).split('**');
    this.storage.get('allforms').then(data=>{
      let templates = JSON.parse(data).templates;
      
      for (let i = 0; i < aid.length; i++) {
        const element = aid[i];
        
        let v = templates.find(e=>e.template.template_id==element);
        if(v){
          this.atitle.push(v.template.template_title);
          this.aids.push(element);
        }
      }
      
    })
    
  }
  getQueryVariable(url, variable) {
    let query = url.split("?")[1]
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  }
  newSubForm(index:number){
    let obj:object = {
      aTitle:decodeURIComponent(this.getQueryVariable(this.router.url,'aTitle')),
      aid:this.aids[index],
      temptitle:decodeURIComponent(this.getQueryVariable(this.router.url,'temptitle')),
      subform:"true",
      mainunid:decodeURIComponent(this.getQueryVariable(this.router.url,'mainunid')),
      cururl:decodeURIComponent(this.getQueryVariable(this.router.url,'cururl'))
    }
    this.router.navigate(["/new-form"], { queryParams:obj});
  }
  goBack(){
    console.log(this.getQueryVariable(this.router.url,'cururl'));
    
    //this.nav.navigateBack('/new-form',{queryParams:this.ulrs});
    this.router.navigateByUrl(decodeURIComponent(this.getQueryVariable(this.router.url,'lasturl')));
  }
}
