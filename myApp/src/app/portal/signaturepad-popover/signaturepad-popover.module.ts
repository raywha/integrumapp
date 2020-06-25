import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignaturepadPopover } from './signaturepad-popover';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


const routes: Routes = [
  {
    path: '',
    component: SignaturepadPopover
  }
];

@NgModule({
  declarations: [
    SignaturepadPopover,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    SignaturepadPopover
  ]
})
export class SignaturepadPopoverModule {}
