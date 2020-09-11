import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ActionSheetController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-dynamicsec',
  templateUrl: './dynamicsec.component.html',
  styleUrls: ['./dynamicsec.component.scss'],
})
export class DynamicsecComponent implements OnInit {
  @Input() sec: any;
  @Input() doctype: string;
  @Input() unid: string;
  @Output() outer = new EventEmitter();

  public index: number = 0;
  public count: number = 0;
  public curque: number = 0;
  public fields: any;
  public dynamicData: any;
  public attLists: any = [];
  public score:string;
  public listModal:boolean = true;
  public yColor:string = 'rgb(74,202,109)';
  public nColor:string = 'rgb(240,60,0)';
  public naColor:string = 'rgb(216,216,216)';
  public cbgcolor:any;

  constructor(
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController

  ) {
    console.log('constructor')
    if(localStorage.getItem("bgcolor")){
      console.log('localStorage-->bgcolor:',localStorage.getItem('bgcolor'))
      this.cbgcolor = localStorage.getItem('bgcolor');
    }
   }

  ngOnInit() {
    console.log('ngOnInit')
    console.log(this.sec)
    console.log('doctype:',this.doctype);
    
    this.unid = this.unid?this.unid:"";
    if(!this.unid){
      this.listModal = false;
    }
    console.log('unid',this.unid);
    this.fields = this.sec.fields;
    this.dynamicData = this.sec.dynamicData;
    this.index = this.sec.index || 0;
    this.count = this.dynamicData.quesList.length;
    const curques = this.dynamicData.quesList[this.index];
    this.fields.forEach((e,i) => {
      if(curques[i]) e.value = curques[i];
      if(e.options){
        e.options = e.options.filter( ele => ele.value!='')
      }
      if(e.xtype == "radio" || e.xtype == "select"){
        let fval: any = e.value;
    if(e.options){
      const v = e.options.find(e => e.text == fval);
      if(v) fval = v.value;
    }
        if(fval == "Yes"){
          e.color = "rgb(74,202,109)";
        }else if(fval == "No"){
          e.color = "rgb(240,60,0)";
        }else if(fval == "N/A"||fval == "NA"){
          e.color = "rgb(216,216,216)";
        }
      }     
    });
    this.score = this.sec.score;
  }

  async  takePicture(name,field,att) {
    const actionSheetAttachment = await this.actionSheetCtrl.create({
      header: 'Add a Photo',
      buttons: [
        {
          text: 'Take a Photo',
          //role: 'destructive',
          handler: () => {
            this.platform.ready().then((readySource) => {
              this.addLatlonToImage(name,field);
            });   
          }
        },
        {
          text: 'Select a Photo',
          handler: () => {
            this.platform.ready().then((readySource) => {
              this.selecPicture(name,field);
            });
          }
        },
        {
          text: 'Remove a Photo',
          handler: () => {
            this.attLists= field.value.filter(function(obj){
              return obj!=att;
            })
            field.value= this.attLists;
            this.setDynamicData();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            //
          }
        }
      ]
    });

    await actionSheetAttachment.present();
  };
  
  async addLatlonToImage(name,field) {
    console.log("------------in addLatlonToImage------");
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    const imgsrc:string = `data:image/${image.format};base64,${image.base64String}`;
    //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(imgsrc);
    //this.photo = `data:image/${image.format};base64,${image.base64String}`;
    this.attLists=[];
    this.attLists.push({
      type:'image',
      value:imgsrc
    })
    if(field.value){
      field.value = field.value.concat( this.attLists);
    } else{
      field.value = this.attLists;
    }
    this.setDynamicData();
   
  };
  async selecPicture(name,field) {
    console.log("------------in select picture------");
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    const imgsrc:string = `data:image/${image.format};base64,${image.base64String}`;
    //this.photo = `data:image/${image.format};base64,${image.base64String}`;
    this.attLists=[];
    this.attLists.push({
      type:'image',
      value:imgsrc
    })
    if(field.value){
      field.value = field.value.concat( this.attLists);
    } else{
      field.value = this.attLists;
    }
    this.setDynamicData();
  }
  
  radioChange(field,val){
    console.log('field:',field);
    console.log('val:',val)
    field.value = val;
    let fval: any = field.value;
    if(field.options){
      const v = field.options.find(e => e.text == fval);
      if(v) fval = v.value;
    }
    if(fval == "Yes"){
      field.color = "rgb(74,202,109)";
    }else if(fval == "No"){
      field.color = "rgb(240,60,0)";
    }else if(fval == "N/A"||fval == "NA"){
      field.color = "rgb(216,216,216)";
    }
    let index = this.index;
    this.fields.forEach((e,i) => {
      if(i==1) this.dynamicData.quesList[index][i] = e.value;
    });
    this.setDynamicData();
    this.comPercent(); 
  }
  go(curque: number){
    console.log('curque:',curque);
    if(curque >= 1 && curque <= this.count){
      let index = this.index;
      this.fields.forEach((e,i) => {
        this.dynamicData.quesList[index][i] = e.value;
        const val = this.dynamicData.quesList[curque-1][i];
        e.value = val;

        if(e.xtype == "radio" || e.xtype == "select"){
          let fval: any = e.value;
          if(e.options){
            const v = e.options.find(ele => ele.text == fval);
            if(v) fval = v.value;
          }
          if(fval == "Yes"){
            e.color = "rgb(74,202,109)";
          }else if(fval == "No"){
            e.color = "rgb(240,60,0)";
          }else if(fval == "N/A"||fval == "NA"){
            e.color = "rgb(216,216,216)";
          } 
        }
      });
      this.index = curque-1;
      this.setDynamicData();
    }
  }
  goto(curque: number){
    const ques = this.dynamicData.quesList[curque-1];
    console.log('ques:',ques)
    ques.forEach((e,i) => {
      this.fields[i].value = e;
      if(this.fields[i].xtype == "radio" || this.fields[i].xtype == "select"){
        let fval: any = e;
        if(this.fields[i].options){
          const v = this.fields[i].options.find(ele => ele.text == fval);
          if(v) fval = v.value;
        }
        if(fval == "Yes"){
          this.fields[i].color = "rgb(74,202,109)";
        }else if(fval == "No"){
          this.fields[i].color = "rgb(240,60,0)";
        }else if(fval == "N/A"||fval == "NA"){
          this.fields[i].color = "rgb(216,216,216)";
        } 
      }
    });
    this.index = curque-1;
    this.setDynamicData();
  }
  comPercent(){  
      const sec = this.sec;
      if(sec.dynamicData){
        let tempscore = 0;
        let naNum = 0;
        let total = sec.dynamicData.quesList.length;
        let yesval: string = 'Yes';
        let naval: string = "N/A";
        let nval: string = "NA";

        if(this.fields[1].options){
          const v = this.fields[1].options.find(e => e.value == yesval);
          if(v) yesval = v.text;
          const nv = this.fields[1].options.find(e => e.value == naval);
          if(nv) naval = nv.text;
          const nav = this.fields[1].options.find(e => e.value == nval);
          if(nav) nval = nav.text;
        }
        sec.dynamicData.quesList.forEach((data,index) => {
          if(data.length>1){
            if (data[1] == yesval) {
              tempscore = tempscore + 1
            }
            if (data[1] == naval || data[1] == nval) {
              naNum = naNum + 1
            }
          } 
        });
        if (total != 0) { 
          let result:string = (tempscore*100 / (total-naNum)).toFixed();
          console.log(result);
          sec.score = tempscore + "/" + (total-naNum) + "   (" + ( result) + "%)"
        }
      }
  }
  setDynamicData(){
    // let index = this.index;
    // this.fields.forEach((e,i)=>{
    //   this.dynamicData.quesList[index][i] = e.value;
    // })
    this.outer.emit({index:this.index,fields:this.fields});
  }
  changeModal(i){
    if(i) this.goto(i)
    if(this.listModal){
      this.listModal = false;
    }else{
      this.listModal = true;
    } 
  }
  
}
