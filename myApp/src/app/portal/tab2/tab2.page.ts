import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public userName:any;
  public address:any={}
  constructor(private geolocation:Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.address=resp.coords;
     //  resp.coords.latitude
       // resp.coords.longitude
      }).catch((error) => {
        console.log('Error getting location', error);
      });
  }
  ngOnInit() {
    

  }


}
