import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RiskMatrixPageModule } from "./riskmatrixModel";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-riskmatrix',
  templateUrl: './riskmatrix.component.html',
  styleUrls: ['./riskmatrix.component.scss'],
})
export class RiskmatrixComponent implements OnInit {

  public consequenceOptions = [];
  public likelihoodOptions = [];
  public riskMatrix: RiskMatrixPageModule;
  public seletedScore;
  public riskLevel;
  public levelColor;
  public levelDes;
  public Consequence;
  public Likelihood;
  public cellId;
  //public RankLegend;
  //rowOne=[];
  public YAxisOptions = [];
  public XAxisOptions = [];
  public riskMatrixSaveData;
  public rmTable;
  public rmtableTdWidth;
  public riskMatrixObj = {};

  public type:string;
  public ulrs = {
    "type":"",
      "unid":  "",
      "aid": "",
      "title": "",
      "stat": "",
      "refresh": new Date().getTime(),
      "cururl":"",

      "value":"",
      "riskName":"",
  }
  public lasturl:string;
  public riskname:string;
  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public navParams: NavParams,
    public nav:NavController
  ) {
    console.log('navParam:',this.navParams.data)
    //this.activeRoute.queryParams.subscribe(res => {
      const res = this.navParams.data.obj;
      if(res){
        console.log('----------------res:',res);
        //console.log('riskMatrixFrameData:',JSON.parse(res.riskMatrixFrameData));
        this.riskMatrix = res.riskMatrixFrameData;
        //this.riskMatrix = JSON.parse(res.riskMatrixFrameData);
        if(res.riskMatrixSaveData){
          this.Consequence  = res.riskMatrixSaveData.Consequence;
          this.Likelihood   = res.riskMatrixSaveData.Likelihood;
          this.seletedScore = res.riskMatrixSaveData.TheScore;
          this.riskLevel    = res.riskMatrixSaveData.RiskRank_2D;
          this.levelDes     = res.riskMatrixSaveData.RankingResultDes_2D;
          this.levelColor   = res.riskMatrixSaveData.ResultColor;
          this.cellId       = res.riskMatrixSaveData.ResultCell;
        }
        this.riskMatrixSaveData = res.riskMatrixSaveData;
        if(this.riskMatrix){
          this.rmTable = this.riskMatrix.RMTable;
          this.YAxisOptions = this.riskMatrix.YAxisOptions;
          this.XAxisOptions = this.riskMatrix.XAxisOptions;
          this.rmtableTdWidth = 100 / this.riskMatrix.matrix_X + '%';
          
          if(this.rmTable && this.cellId){
            let rmTable = this.rmTable;
            let i:number = 0;
            for(let key in rmTable){
              i++;
            }
            for(let j=1;j<=i;j++){
              let key = 'r'+j;
              let tmp:any;
              if(rmTable.hasOwnProperty(key)){
                tmp = rmTable[key];
                let v = tmp.find(item=>item.CellID ==this.cellId);
                if(v){
                  v.display = true;
                  break;
                }
              }
            }
          }
        }

        this.type = res.type;
        this.ulrs.type = res.type;
        this.ulrs.unid = res.unid;
        this.ulrs.aid = res.aid;
        this.ulrs.title = res.title;
        this.ulrs.stat = res.stat;
        this.ulrs.cururl = res.cururl;

        this.lasturl = res.lasturl;
        this.riskname = res.riskName;
      }
     
    //})


  }

  ngOnInit() {
  }
  ionViewDidLoad() {

   
    
  };
  detectTdCellBg(){

  }
  getRows(index){
    let rowsData=[];
    let key='r'+(index+1);
    if (this.rmTable.hasOwnProperty(key)) rowsData= this.rmTable[key]; 
    for(let h=0;h<rowsData.length;h++)
         {
           rowsData[h].likelihood=this.YAxisOptions[index];
           rowsData[h].consequence=this.XAxisOptions[h];
          
         }
   //this.rmTable[key]=rowsData;
    return rowsData;
  };
  initCellDisplay(){
    let el= this.rmTable;
    let hideDisplay=[];
    if(!el) return;
    for (var key in el){
     if (el.hasOwnProperty(key)) 
     {
       hideDisplay.push(el[key])
     }
    }
     for(let j=0;j<hideDisplay.length;j++)
     {
       for(let h=0;h<hideDisplay[j].length;h++)
       {
         hideDisplay[j][h].display=false;
       }
      
     }
   };
   selectedTableCell(option){
     this.initCellDisplay();
     option.display=true;
  
     this.seletedScore = option.Score;
     this.riskLevel = option.Rank;
     this.levelColor = option.Color;
     this.Consequence = option.consequence.value;
     this.Likelihood = option.likelihood.value;
     this.levelDes=option.Des;
     
     this.riskMatrixObj={
                        ResultCell:option.CellID,
                        Consequence:option.consequence.value,
                        Likelihood:option.likelihood.value,
                        TheScore:option.Score,
                        RiskRank_2D:option.Rank,
                        RankingResultDes_2D:option.Des,
                        ResultColor:option.Color
                      };
     
   };
   showCellDisplay(){
   
    let el= this.rmTable;
    let showDisplay=[];
    if(!el) return;
    for (var key in el){
     if (el.hasOwnProperty(key)) 
     {
       showDisplay.push(el[key])
     }
    }
    //alert(JSON.stringify(showDisplay));
     for(let j=0;j<showDisplay.length;j++)
     {
       for(let h=0;h<showDisplay[j].length;h++)
       {
         
         if((showDisplay[j][h].likelihood.value==this.Likelihood)&&(showDisplay[j][h].consequence.value==this.Consequence))
          {
          showDisplay[j][h].display=true;
          this.seletedScore = showDisplay[j][h].Score;
          this.riskLevel = showDisplay[j][h].Rank;
          this.levelColor = showDisplay[j][h].Color;
          this.levelDes= showDisplay[j][h].RankingResultDes_2D;
          this.cellId=showDisplay[j][h].CellID;
          break;
          }
          
       }
      
     }
     //Reset riskMatrixObj
     this.riskMatrixObj={
          ResultCell:this.cellId,
          Consequence:this.Consequence,
          Likelihood:this.Likelihood,
          TheScore:this.seletedScore,
          RiskRank_2D:this.riskLevel ,
          RankingResultDes_2D:this.levelDes,
          ResultColor:this.levelColor
      };
   };
  
   calculate(){
     let xWeighting=0;
     let yWeighting=0;
     this.initCellDisplay();
     for(let y=0;y<this.YAxisOptions.length;y++)
     {
       if(this.YAxisOptions[y].value==this.Likelihood)
        yWeighting=this.YAxisOptions[y].Weighting;
     }
     for(let x=0;x<this.XAxisOptions.length;x++)
     {
       if(this.XAxisOptions[x].value==this.Consequence)
        xWeighting=this.XAxisOptions[x].Weighting;
     }
     if(this.riskMatrix.CalculationMethod=="*") this.seletedScore = xWeighting * yWeighting;
     
     if(this.riskMatrix.CalculationMethod=="+") this.seletedScore = xWeighting + yWeighting;
     
  this.showCellDisplay();
  
   };
  
  btnok(){
    /*
    this.ulrs.value = JSON.stringify(this.riskMatrixObj);
    this.ulrs.riskName = this.riskname;
    
    //this.nav.navigateBack('/new-form',{queryParams:this.ulrs});
    this.router.navigate(['new-form'],{queryParams:this.ulrs})
    */
   this.navParams.data.modal.dismiss({
    riskName: this.riskname,
    result:JSON.stringify(this.riskMatrixObj)
   })
  }
  goBack(){
    //this.nav.navigateBack('/new-form',{queryParams:this.ulrs});
    this.router.navigateByUrl(this.lasturl);
  }
  dismiss() {
    this.navParams.data.modal.dismiss({
      result: ''
    })
  }
}
