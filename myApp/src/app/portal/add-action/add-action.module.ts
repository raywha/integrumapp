import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddActionPage } from './add-action.page';
import { TranslateModule } from '@ngx-translate/core';
import { SecurityComponent } from './component/security/security.component';
const routes: Routes = [
  {
    path: '',
    component: AddActionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddActionPage,SecurityComponent],
  entryComponents:[SecurityComponent]
})
export class AddActionPageModule {}
