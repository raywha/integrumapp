import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {


   flag = 'home';
  change(event) {
      this.flag=event.detail.tab;
  }
  constructor() {}

}
