import { Injectable } from '@angular/core';

@Injectable()

export class FormDrafts {

  getSavedFiles(fromtype) {
    let filesArray = [];
    let file = localStorage.getItem(fromtype);
    if (file) {
      filesArray = JSON.parse(file);
    }
    else {
      filesArray = [];
    }
    return filesArray;
  };
  deleteFile(draft, fromtype) {
    let filesArray = [];
    let file = localStorage.getItem(fromtype);
    if (file) {
      filesArray = JSON.parse(file);
    }
    for (let j = 0; j < filesArray.length; j++) {
      if (draft == filesArray[j].name) {
        let index = j;
        filesArray.splice(index, 1);
        localStorage.setItem(fromtype, JSON.stringify(filesArray));
        break;
      }
    };

  };

  saveFiletoBepersisted(newFiles, status, templateId, vid, draftSavedTime,initiatorOrMR,WFStatus, draftOtherInfo?) {
    console.log('Hello FormDrafts Provider saveFiletoBepersisted ========', newFiles, status, templateId, draftSavedTime);

    let filesArray = [];
    let file = localStorage.getItem(templateId);
    if (file) {
      filesArray = JSON.parse(file);
    }
    const retNo: string = this.createRefNo(templateId);
    filesArray.unshift({ name: newFiles, status: status, WFStatus, formMR:initiatorOrMR, calendarDate: draftSavedTime, draftOtherInfo: draftOtherInfo, DocRefNumber: retNo, vid  });

    //localStorage.setItem(this.FILE_STORAGE_KEY, JSON.stringify(this.filesArray));
    localStorage.setItem(templateId, JSON.stringify(filesArray));
  };
  createRefNo(templateId: string){
    const docs = localStorage.getItem(templateId); 
    let newRefNo: string = templateId + '-001';
    if(docs){
      const docsArr = JSON.parse(docs);
      if(docsArr.length > 0){
        docsArr.sort( (a,b) => {
          if(a.DocRefNumber > b.DocRefNumber){
            return -1;
          }else if(a.DocRefNumber < b.DocRefNumber){
            return 1;
          }else{
            return 0;
          }
        })
        const lastRefNo: any = docsArr[0].DocRefNumber;
        if(lastRefNo.includes('-')){
          const newno: number = Number.parseInt(lastRefNo.split('-')[1])+1;
          newRefNo = (newno+'').padStart(3,'0');
          newRefNo = templateId + '-' + newRefNo;
        }
      }
      
    }
    return newRefNo;
  }
  updateStatus(fileName,status,WFStatus,fromtype,draftSavedTime, initiatorOrMR){
    let filesArray=[];
    let file=localStorage.getItem(fromtype);
        if(file)
         {
         filesArray = JSON.parse(file);
         }
   for(let k=0;k<filesArray.length;k++)
   {
     if(filesArray[k].name==fileName)
     {
       filesArray[k].status=status;
       filesArray[k].WFStatus=WFStatus;
       filesArray[k].calendarDate=draftSavedTime;
       filesArray[k].formMR=initiatorOrMR;
       localStorage.setItem(fromtype, JSON.stringify(filesArray));
        break;
     }
   }
  };
}