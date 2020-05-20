import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { commonCtrl } from "../../common/common";
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  providers: [commonCtrl]
})
export class SecurityComponent implements OnInit {
  public listSlect: any = [
    { person: 'First Name', Manager: 'EMPFullName' },
    { person: 'Last Name', Manager: 'EmpLastName' },
    { person: 'Email', Manager: 'EmpEmail' }
  ];
  public selectIndex: Number = 1;
  public selectText: string = this.listSlect[0].person;
  public selectManger: string = this.listSlect[0].Manager;
  public isSelectList: boolean = false;
  public isDelect: boolean = false;
  public listDatabak: any;
  public stype: string;
  public fval: any;
  public listData: any = [
    { title: 'sholla Ameko' },
    { title: 'xuze ren' },
    { title: 'tengfenng hu' },
    { title: 'hongtu zhao' }
  ];
  public searchName: string = ''
  public checkedEmp: any = [];
  public searchkey: String;
  public start: number;
  public pnum: number = 30;
  public title:string ="Security Manager";
  public firstData:any =[];
  public cbgcolor = "#b81321";
  public plen:number = 0;
  public limitlen:number = 500;
  constructor(public navParams: NavParams, public storage: Storage, public commonCtrl: commonCtrl) {

  }

  ngOnInit() {
    console.log('this.navParams.data:', this.navParams.data);
      this.stype = this.navParams.data.stype;
      this.fval = this.navParams.data.fieldvalue;
      this.title =this.navParams.data.label
      this.cbgcolor = this.navParams.data.cbgcolor;
      if (!this.fval) {
        this.fval = [];
      } else {
        this.fval = this.fval.split(';');
      }
    //get Person
    this.storage.get('psninfo').then(data => {
      //console.log(JSON.parse(data))
      let persons: any = JSON.parse(data).person;
      this.start = 0;
      this.listData = [];
      this.listDatabak = persons;
      this.plen = persons.length;
      if (persons.length > this.pnum) {
        for (let i = 0; i < this.pnum; i++) {
          this.listData.push(persons[i]);
        }
      } else {
        this.listData = persons;
      }
      this.firstData=this.listData;
      console.log('this.listData:', this.listData);
      

      if (this.stype == 'multi') {
        this.listDatabak.forEach(e => {
          if (this.fval.indexOf(e.EMPFullName) == -1) {
            e.checked = false;
          } else {
            e.checked = true;
          }
        });
      }
    })
  }
  getSelectlist() {
    this.isSelectList = !this.isSelectList;
  }
  select(item, index) {
    this.selectText = item.person;
    this.selectIndex = index;
    this.selectManger = item.Manager
    this.isSelectList = false;

  }
  delectSelect() {
    this.searchName = '';
    this.isDelect = false;
  }
  getSearch() {
    this.isDelect = true;
    //发送请求
  }
  dismiss() {
    this.navParams.data.modal.dismiss({
      result: this.fval.join(";")
    })
  }
  setManager(item) {
    this.navParams.data.modal.dismiss({
      result: item.EMPFullName
    })
  }
  clean() {
    // this.navParams.data.modal.dismiss({
    //   result: ''
    // })
    this.searchkey = ""
    this.listData = this.firstData
  }

  getItems() {
    if(this.plen>0 && this.plen<=this.limitlen){
      this.fnSearch();
    }
  };
  fnSearch(){
    this.listData = this.listDatabak
    let val = this.searchkey;
    if (val && val.trim() != '') {
      this.listData = this.listData.filter((item) => {
        return (item[this.selectManger].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  addCheckedItems(ischecked, item) {

    if (ischecked) {
      this.checkedEmp.push(item);
    }
    else {
      let index = this.checkedEmp.indexOf(item);
      this.checkedEmp.splice(index, 1);
    }

  };
  saveChoice() {
    if (this.stype == 'multi') {
      this.navParams.data.modal.dismiss({
        result: this.checkedEmp.join(';')
      })
    }

  }
  doInfinite(infiniteScroll) {
    this.start += this.pnum;
    console.log('this.start:', this.start)
    setTimeout(() => {
      this.commonCtrl.show();
      for (let i = this.start; i < this.start + this.pnum; i++) {
        if (this.listDatabak[i]) {
          this.listData.push(this.listDatabak[i]);
          console.log('this.listData:', this.listData)
          if (this.listData.length == this.listDatabak.length) {

            break;

          }
        }

      }//edd for loop
      infiniteScroll.target.complete();
      this.commonCtrl.hide();
    }, 500);

  };
}
