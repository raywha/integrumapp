import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from "../../services/setup/account.service";
import { Storage } from '@ionic/storage';
import { first } from 'rxjs/operators';

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
  constructor(public translate :TranslateService, private storage:Storage, public account:AccountService) { 
    this.translate.get('setting').subscribe(res => {
      this.setting = res;
    })
    this.translate.get('release').subscribe(res => {
      this.release = res;
    })
  }

  ngOnInit() {
    this.account.getReleaseInfo().pipe(first()).subscribe(
      data => {
        data = JSON.parse(data.data);

        console.log('getReleaseInfo:',data)
        this.versionno = data.versionno;
        this.releaseddate = data.releaseddate;
        this.whatnew = data.whatnew;
      }
    )
  }

}
