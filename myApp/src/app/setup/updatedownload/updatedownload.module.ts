import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatedownloadPageRoutingModule } from './updatedownload-routing.module';

import { UpdatedownloadPage } from './updatedownload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatedownloadPageRoutingModule
  ],
  declarations: [UpdatedownloadPage]
})
export class UpdatedownloadPageModule {}
