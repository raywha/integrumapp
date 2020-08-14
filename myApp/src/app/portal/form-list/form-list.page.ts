import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GetAppPortalService } from '../../services/get-app-portal.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { commonCtrl } from "../../common/common";
import { NavController } from '@ionic/angular'; 
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.page.html',
  styleUrls: ['./form-list.page.scss'],
  providers: [commonCtrl]
})
export class FormListPage implements OnInit {
  public data = [] //{"DocRefNumber":"测试我得标题啦","WFStatus":"","formMR":""}
  public databak =[];
  public myviewdata = [];
  public vid: string;
  public para = {
    "key": "",
    "count": "",
    "curpage": ""
  }
  public vtitle: string;
  public draftime: any;
  public stype: string;
  public  formid:string ;
  public searchkey: any={
    "start":1,
    "count":20
  }
  public cururl:string;
  public portaltitle:string ;
  public cbgcolor = "#b81321";
  public isMyView: boolean = false;
  constructor(
    private storage: Storage,
    public geapp: GetAppPortalService,
    public activeRoute: ActivatedRoute,
    public commonCtrl: commonCtrl,
    public nav:NavController,
    public router:Router,
    
  ) {
    if(localStorage.getItem("bgcolor")){
      this.cbgcolor = localStorage.getItem("bgcolor");
    }
    console.log(  this.searchkey.start)
    this.activeRoute.queryParams.subscribe(res => {
      this.portaltitle=res.temptitle
    })


    this.getData();
    this.cururl=this.router.url;


  }

  ngOnInit() {
  }


  doRefresh(evt: any): void {
    console.log('Begin async operation');
    this.getData();
    setTimeout(() => {
      console.log('Async operation has ended');
      evt.target.complete();
    }, 2000);
  }


  loadData(event) {
   
    this.searchkey.start=this.searchkey.start+1
    console.log(this.searchkey.start)
    setTimeout(() => {
      this.activeRoute.queryParams.subscribe(res => {
        console.log(res);
        if (res) {
          this.stype = res.type
          this.formid=res.formid
         
          if (this.stype === "formlist") {
            this.vid = res.vid.split("/")[1].split("?")[0]
            this.vtitle = res.vtitle
          console.log('loaddata..',this.myviewdata);
          console.log('ismyview',this.isMyView)
            if(this.isMyView){
              //this.commonCtrl.show();
              
              const istart: number = (this.searchkey.start-1)*this.searchkey.count;
                const iend: number = istart + this.searchkey.count;
                const ndata = this.myviewdata.slice(istart,iend);
                this.data = this.data.concat(ndata);
                this.databak = this.data;
                console.log('this.data.',this.data);
                this.commonCtrl.hide();
                event.target.complete();
                //this.commonCtrl.hide();
              
            }else{
              this.commonCtrl.processShow('loading....');

              this.storage.get("loginDetails").then(data => {
                this.para.key = this.vid;
                this.para.count = this.searchkey.count
                this.para.curpage = this.searchkey.start
                this.geapp.getViewData(data, this.para).pipe(first())
                  .subscribe(data => {
                    data = JSON.parse(data.data);
                    console.log('viewlist getView data:',data)
                    let tempdate;
                    data.data.forEach(element => {
                      // tempdate = new Date(element.calendarDate.replace("ZE8", ""))
                      // //this.draftime = tempdate.getFullYear() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getDate()
                      // this.draftime = tempdate.getDate() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getFullYear()
                      // element.calendarDate = this.draftime;
                      //element.calendarDate = element.calendarDate.split(' ')[0]
                      if(element.calendarDate!='') element.calendarDate = moment(`${element.calendarDate}`,'YYYY-MM-DD').format('DD/MM/YYYY');
                    });
                    this.data = this.data.concat( data.data)
                    this.databak =this.data
                    event.target.complete();
                    this.commonCtrl.processHide();
                  })
              })
            }
            
          }else{
            //getass
            this.vid=res.vid
            this.storage.get("loginDetails").then(data => {
              this.para.key = this.vid;
              this.geapp.getActDocsAssoForms(data, this.para).pipe(first())
                .subscribe(data => {
                  data = JSON.parse(data.data);
                  console.log('viewlist getActDocsAssoForms data:',data)
                  let tempdate;
                  data.actDocs.forEach(element => {
                    if(element.ActDueforCompletion){
                      // tempdate = new Date(element.ActDueforCompletion.replace("ZE8", ""))
                      // this.draftime = tempdate.getFullYear() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getDate()
                      // element.ActDueforCompletion = this.draftime;
                      //element.ActDueforCompletion = element.ActDueforCompletion.split(' ')[0];
                      if(element.ActDueforCompletion!='') element.ActDueforCompletion = moment(`${element.ActDueforCompletion}`,'YYYY-MM-DD').format('DD/MM/YYYY')
                    }
                  
                  });
                  this.data = data.actDocs
                  this.databak =this.data
                  this.commonCtrl.processHide();
                })
            })
          }
        }
        this.commonCtrl.processHide();
      })
      if (this.data.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }
  getData() {
    this.searchkey.start=1
    this.activeRoute.queryParams.subscribe(res => {
      console.log(res);
      this.commonCtrl.processShow('loading....')
      if (res) {
        this.stype = res.type
        this.formid=res.formid
        if (this.stype === "formlist") {
          if(res.vid && res.vid!='') this.vid = res.vid.split("/")[1].split("?")[0]
          this.vtitle = res.vtitle
          if(this.vid.startsWith('my_') || this.vid.startsWith('My_')) this.isMyView = true;
          this.storage.get("loginDetails").then(data => {
            //if(data.code=="kn001") this.cbgcolor = "#3880ff";
            this.para.key = this.vid;
            this.para.count = this.searchkey.count
            this.para.curpage = this.searchkey.start
            this.geapp.getViewData(data, this.para).pipe(first())
              .subscribe(data => {
                // console.log(data)
                data = JSON.parse(data.data);
                console.log('getdata:',data)
                let tempdate;
                data.data.forEach(element => {
                  // tempdate = new Date(element.calendarDate.replace("ZE8", ""))
                  // //this.draftime = tempdate.getFullYear() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getDate()
                  // this.draftime = tempdate.getDate() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getFullYear()
                  // element.calendarDate = this.draftime;
                  if(element.calendarDate!='') element.calendarDate = moment(`${element.calendarDate}`,'YYYY-MM-DD').format('DD/MM/YYYY');
                });
                if(this.isMyView){
                  this.myviewdata = data.data;
                  this.data = data.data.slice(0,this.searchkey.count);
                  this.databak = this.data;
                }else{
                  this.data = data.data
                  this.databak =this.data
                }
                this.commonCtrl.processHide();
              })
          })
        }else{
          //getass
          this.vid=res.vid
          this.storage.get("loginDetails").then(data => {
            //if(data.code=="kn001") this.cbgcolor = "#3880ff";
            this.para.key = this.vid;
            this.geapp.getActDocsAssoForms(data, this.para).pipe(first())
              .subscribe(data => {
                console.log(data)
                data = JSON.parse(data.data);
                let tempdate;
                data.actDocs.forEach(element => {
                  if(element.ActDueforCompletion){
                    // tempdate = new Date(element.ActDueforCompletion.replace("ZE8", ""))
                    // this.draftime = tempdate.getFullYear() + "/" + (tempdate.getMonth() + 1) + "/" + tempdate.getDate()
                    // element.ActDueforCompletion = this.draftime;
                    //element.ActDueforCompletion = element.ActDueforCompletion.split(' ')[0];
                    if(element.ActDueforCompletion!='') element.ActDueforCompletion = moment(`${element.ActDueforCompletion}`,'YYYY-MM-DD').format('DD/MM/YYYY')
                  }
                
                });
                this.data = data.actDocs
                this.databak =this.data
                this.commonCtrl.processHide();
              })
          })
        }
        //this.commonCtrl.hide()
      }
    })
  }
  goBack(){
   // this.nav.back()
    　this.nav.navigateBack('/tabs/tab1',{queryParams:{title:this.portaltitle}});
    
  }

  getItems(ev: any) {

    console.log()
    this.data =this.databak
    let val = ev.target.value;
   console.log(val)
    if (val && val.trim() != '') {
      this.data = this.databak.filter((item) => {
        
        if(item.FieldIDsForSearch){
          let v = item.FieldIDsForSearch.find(it=>it.includes(val) || it.toLowerCase().includes(val));
          if(v) return item;
        }else{
          if(item.title){
            return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }else{
            return (item.DocRefNumber.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }
        }
      })
    }
  };
}
