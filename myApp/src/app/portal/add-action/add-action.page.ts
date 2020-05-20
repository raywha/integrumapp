import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { SecurityComponent } from './component/security/security.component';
import { CreateFromService } from '../../services/create-from/create-from.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { first } from 'rxjs/operators';
import { from } from 'rxjs';
@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.page.html',
  styleUrls: ['./add-action.page.scss'],
})
export class AddActionPage implements OnInit {
  public action: any;
  public headBtn: any = [];
  public headBtb: any = [
    {
      status: 'draft', btn: [
        { id: '2', text: 'Submit' },
        { id: '1', text: 'Sava' },
        { id: '0', text: 'Close' }]
    },
    {
      status: 'open', btn: [
        { id: '4', text: 'Delete' },
        { id: '3', text: 'Re-assign' },
        { id: '2', text: 'Send for Review' },
        { id: '1', text: 'Sava' },
        { id: '0', text: 'Close' }]
    },
    {
      status: 'MR', btn: [
        { id: 'Return to Assignee', text: 'Return to Assignee' },
        { id: 'Approve', text: 'Approve' },
        { id: 'Re-assign', text: 'Re-assign' },
        { id: 'Delete', text: 'Delete' },
        { id: '1', text: 'Sava' },
        { id: '0', text: 'Close' }]
    },
    {
      status: 'IR', btn: [
        { id: 'Send for Review', text: 'Send for Review' },
        { id: 'Re-assign', text: 'Re-assign' },
        { id: 'Delete', text: 'Delete' },
        { id: '1', text: 'Sava' },
        { id: '0', text: 'Close' }]
    },
  ]
  public showTrail: boolean = false;
  public trailBox: boolean = false;
  public isShowBtn: boolean = false;
  public managerName: string;
  public optionData: any = []
  public description: string;
  public title: string;
  public priority: string;
  public dueDate: string;
  public imgSrc: any=[];//后台返回缩略图
  public address:any={}
  constructor(
    public modal: ModalController,
    public translate :TranslateService,
    private storage: Storage,
    private transfer: FileTransfer,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public createFrom: CreateFromService,
    private geolocation:Geolocation
  ) {
    this.geolocation.getCurrentPosition().then((resp) => {
     this.address=resp.coords;
    //  resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
   }

  ngOnInit() {
    this.action = {
      pid: '',
      actTitle: '',
      actAssignee: '',
      actDesc: '',
      actDueDate: '',
      actAtt: '',
      actPriority: '',
      actPriorityTitle: '',
      actionRevToInitiator: '',
      AuditTrail: '',

    }
    this.headBtn = this.headBtb[1].btn;
    this.storage.get("loginDetails").then(data => {
      this.createFrom.getPriority(data).pipe(first()).subscribe(
        data => {
          //console.log(data)
          this.optionData = data.data;
        }
      )
    })

  }
  //查找名称
  async getName() {
    const modal = await this.modal.create({
      showBackdrop: true,
      component: SecurityComponent,
      componentProps: { value: 111 }
    });
    modal.present();
    //监听销毁的事件
    const { data } = await modal.onDidDismiss();
    console.log(data)
    this.managerName = data.result;
  }
  //打开按钮
  getBtnPopover() {
    this.isShowBtn = !this.isShowBtn;

  }
  //按钮的事件
  getSwitchBtn(item) {
    console.log(item)
    this.isShowBtn = false;
    if (item.id == '1') {
      this.isShowBtn = false;
      console.log(this.action)
    }
  }
  //拍照上传
  doCamea() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,//
      encodingType: this.camera.EncodingType.JPEG, // 图片格式 JPEG=0 PNG=1
      mediaType: this.camera.MediaType.PICTURE, // 媒体类型
      sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源  CAMERA相机 PHOTOLIBRARY 图库
      allowEdit: true, // 允许编辑
      targetWidth: 300, // 缩放图片的宽度
      targetHeight: 300, // 缩放图片的高度
      saveToPhotoAlbum: false, // 是否保存到相册
      correctOrientation: true, // 设置摄像机拍摄的图像是否为正确的方向
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imgSrc.push(base64Image);
      // 返回拍照的地址
      this.doUpload(imageData);
    }, (err) => {
      alert(err);
    });

  }
  // 文件上传
  doUpload(src: any) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      mimeType: 'image/jpeg',
      httpMethod: 'POST',
      params: { username: '张三', age: '20', height: '190' },
      headers: {}
    };

    const api = 'http://39.108.159.135/imgupload';

    fileTransfer.upload(src, encodeURI(api), options)
      .then((data) => {
        alert(JSON.stringify(data));
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }
  //图片上传
  chooseImg() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,//
      encodingType: this.camera.EncodingType.JPEG, // 图片格式 JPEG=0 PNG=1
      mediaType: this.camera.MediaType.PICTURE, // 媒体类型
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, // 图片来源  CAMERA相机 PHOTOLIBRARY 图库
      allowEdit: true, // 允许编辑
      targetWidth: 300, // 缩放图片的宽度
      targetHeight: 300, // 缩放图片的高度
      saveToPhotoAlbum: false, // 是否保存到相册
      correctOrientation: true, // 设置摄像机拍摄的图像是否为正确的方向
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imgSrc.push(base64Image) ;
      // 返回拍照的地址
      this.doUpload(imageData);
    }, (err) => {
      alert(err);
    });
  }
  imgDelect(key){
    let Astr=this.imgSrc.splice(key,1);
    console.log(this.imgSrc)
    console.log(Astr)
  }
  setLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.address=resp.coords;
     //  resp.coords.latitude
       // resp.coords.longitude
      }).catch((error) => {
        console.log('Error getting location', error);
      });
  }

}
