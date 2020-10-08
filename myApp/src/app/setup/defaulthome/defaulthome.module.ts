import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefaulthomePageRoutingModule } from './defaulthome-routing.module';

import { DefaulthomePage } from './defaulthome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DefaulthomePageRoutingModule
  ],
  declarations: [DefaulthomePage]
})
export class DefaulthomePageModule {}
