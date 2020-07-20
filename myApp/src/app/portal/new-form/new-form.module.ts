import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewFormPage } from './new-form.page';
import { PopoverComponent } from "../../common/popover/popover.component";
import { SecurityComponent} from "../../common/security/security.component";
import {OpenModalComponent} from "../../common/open-modal/open-modal.component";
import { RiskmatrixComponent } from "../../common/riskmatrix/riskmatrix.component";
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignaturepadPopover } from '../signaturepad-popover/signaturepad-popover';
import { RoleComponent } from "../../common/role/role.component";
import { MrtemplateComponent } from "../../common/mrtemplate/mrtemplate.component";
import { MicrodbComponent } from '../microdb/microdb.component';
const routes: Routes = [
  {
    path: '',
    component: NewFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignaturePadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewFormPage,PopoverComponent,SecurityComponent,OpenModalComponent,RiskmatrixComponent,SignaturepadPopover,RoleComponent,MrtemplateComponent,MicrodbComponent],
  entryComponents:[PopoverComponent,SecurityComponent,OpenModalComponent,RiskmatrixComponent,SignaturepadPopover,RoleComponent,MrtemplateComponent,MicrodbComponent]
})
export class NewFormPageModule {}
