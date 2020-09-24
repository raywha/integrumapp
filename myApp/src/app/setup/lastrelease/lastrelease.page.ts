import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-lastrelease',
  templateUrl: './lastrelease.page.html',
  styleUrls: ['./lastrelease.page.scss'],
})
export class LastreleasePage implements OnInit {
  public setting: any = [];
  public release: any = [];
  public versionno: string = '';
  public releaseddate: string = '';
  public whatnew: string = '';
  constructor(public translate :TranslateService, private storage:Storage) { 
    this.translate.get('setting').subscribe(res => {
      this.setting = res;
    })
    this.translate.get('release').subscribe(res => {
      this.release = res;
    })
    this.storage.get("releaseinfo").then(data=>{
      data = JSON.parse(data);
      console.log('releaseinfo:',data);
      this.versionno = data.versionno;
      this.releaseddate = data.releaseddate;
      this.whatnew = data.whatnew;
    })
  }

  ngOnInit() {
    
  }

}
