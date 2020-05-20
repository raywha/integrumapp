import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { first } from 'rxjs/operators';
import { CreateFromService } from '../../../../services/create-from/create-from.service';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  public listSlect: any = [
    { person: 'First Name', Manager: 'First Name' },
    { person: 'Last Name', Manager: 'Last Name' },
    { person: 'Email', Manager: 'Email' }
  ];
  public selectIndex:Number=1;
  public selectText:string='First Name';
  public isSelectList:boolean=false;
  public isDelect:boolean=false;
  public listData:any=[];
  public listName:any=[];
  public searchName:string=''
  constructor(public navParams:NavParams,public getPersonSerice: CreateFromService,private storage:Storage) { }

  ngOnInit() {
      this.storage.get("loginDetails").then(data=>{
     this.getPersonSerice.getPersonInfo(data,data.username).pipe(first()).subscribe(
       data => {
         console.log(data)
        this.listData=data.person;
        this.listName=this.listData;
       }
     )
   })
  }
  getSelectlist(){
    this.isSelectList=!this.isSelectList;
  }
  select(item,index){
    this.selectText=item.person;
    this.selectIndex=index;
    this.isSelectList=false;
  }
  getSearch(e){
    this.searchName=e.target.value;
    this.isDelect=true;
    let lowerList=[];
   for(let index = 0; index <  this.listName.length; index++) {
    if(this.listName[index].EMPFullName.toLowerCase().indexOf(this.searchName.toLowerCase())>-1){
      lowerList.push(this.listName[index])
    }
  }
    this.listData=lowerList;
    console.log(this.listData)
    //发送请求
   
  }
  dismiss(){
    this.navParams.data.modal.dismiss({
      result:''
    })
  }
  setManager(item){
    this.navParams.data.modal.dismiss({
      result:item.EMPFullName
    })
  }
  clean(){
    this.navParams.data.modal.dismiss({
      result:''
    })
  }
}
