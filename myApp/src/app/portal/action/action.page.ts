import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { CreateFromService } from '../../services/create-from/create-from.service';
@Component({
  selector: 'app-action',
  templateUrl: './action.page.html',
  styleUrls: ['./action.page.scss'],
})
export class ActionPage implements OnInit {
  public list:any=[
  ];
  public isShowBtn:boolean=false;
  public showTrail: boolean = false;
  public optionData:any;
  public actPriority:string='';
  public headBtn: any = [];
  public btnBox: any = [
    {
      status: 'draft', btn: [
        { id: '1', text: 'Edit' },
        { id: '0', text: 'Close' }]
    },
    {
      status: 'open', btn: [
        {id:'Delete',text:'Delete'},
        { id: 'Re-assign', text: 'Re-assign' },
        { id: 'Edit', text: 'Edit' },
        { id: 'Close', text: 'Close' }]
    },
    {
      status: 'MR', btn: [
        {id:'Delete',text:'Delete'},
        { id: 'Re-assign', text: 'Re-assign' },
        { id: 'Edit', text: 'Edit' },
        { id: 'Close', text: 'Close' }]
    },
    {
      status: 'IR', btn: [
        {id:'Delete',text:'Delete'},
        { id: 'Re-assign', text: 'Re-assign' },
        { id: 'Edit', text: 'Edit' },
        { id: 'Close', text: 'Close' }]
    },
  ]
  public actionList:any=[];
  constructor(public getActionSerice: CreateFromService, private storage:Storage,public translate :TranslateService,) { }

  ngOnInit() {
    this.headBtn = this.btnBox[1].btn;
    this.actionList=[
      {
        FormMR: "ShiJun Tian",
        ParentDocument: "/0/A7FE4624DF821F4C482584BE001C0CB7",
        ActionTitle: "New Action button testing",
        Attachment: [ ],
        EmployeeAssigned: [
        "ShiJun Tian"
        ],
        Priority: "Minor",
        DocRefNumber: "DTC-1119-0004-ACT-001",
        WFStatus: "Open",
        AuditTrail: "***** Created by ShiJun Tian on 19-11-27 上午6:53 ***** ",
        DueDate: "0002/11/30",
        ParentDocumentRefNo: "DTC-1119-0004",
        Description: "created from New Action button"
        }
    ];
    this.actionList.forEach(item => {
      item.EmployeeAssigned=item.EmployeeAssigned.join(',');
      let obj={"show":false}
      this.list.push(obj)
    });
    this.storage.get("loginDetails").then(data=>{
      this.getActionSerice.getPriority(data).pipe(first()).subscribe(
        data => {
          //console.log(data)
          data = JSON.parse(data.data)
          this.optionData=data.data;
        }
      )
    })
  //   this.storage.get("loginDetails").then(data=>{
  //     console.log(data)
  //    this.getActionSerice.getAction(data,'1A9D2024BB1EA9E4482584BE007DBC3E').pipe(first()).subscribe(
  //      data => {
  //        console.log(data)
  //       this.actionList=data;
  //       this.actionList.forEach(item => {
  //         item.EmployeeAssigned=item.EmployeeAssigned.join(',')
  //       });
  //      }
  //    )
  //  })
  }
  getBtnPopover() {
    console.log(11)
    this.isShowBtn = !this.isShowBtn;
  }
  getSwitchBtn(item){
    console.log(item)
  }
}
