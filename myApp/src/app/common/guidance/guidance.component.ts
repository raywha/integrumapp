import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-guidance',
  templateUrl: './guidance.component.html',
  styleUrls: ['./guidance.component.scss'],
})
export class GuidanceComponent implements OnInit {
  private content: string;
  private title: string;
  constructor(
    private nav: NavParams,
    private sanitizer: DomSanitizer

  ) { 
    this.content =  this.nav.data.content;
    this.title = this.nav.data.title;
  }

  ngOnInit() {}
  dismiss() {
    this.nav.data.modal.dismiss();
  }
}
