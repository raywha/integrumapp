import { OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import{Injectable}from'@angular/core';
@Injectable()

export class commonCtrl implements OnInit {
  public loading: any;
  public processing:any;
  constructor(
    public loadingController: LoadingController,
  ) {
    
    
   


  }

  async  show() {
    this.loading = await this.loadingController.create({
      message: 'loading....',
      duration: 1000
    });
    await this.loading.present();
  }
  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async processShow(message:string){
    this.processing = await this.loadingController.create({message,duration:1000*60*5});
    await this.processing.present();
  }

  async processHide(){
    if(this.processing) await this.processing.dismiss();
  }

  ngOnInit() {
  }

}
