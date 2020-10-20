import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyactionPageRoutingModule } from './myaction-routing.module';

import { MyactionPage } from './myaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyactionPageRoutingModule
  ],
  declarations: [MyactionPage]
})
export class MyactionPageModule {}
