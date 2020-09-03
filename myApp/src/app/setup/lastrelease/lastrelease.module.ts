import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LastreleasePageRoutingModule } from './lastrelease-routing.module';

import { LastreleasePage } from './lastrelease.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LastreleasePageRoutingModule
  ],
  declarations: [LastreleasePage]
})
export class LastreleasePageModule {}
