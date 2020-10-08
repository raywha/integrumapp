import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaulthomePage } from './defaulthome.page';

const routes: Routes = [
  {
    path: '',
    component: DefaulthomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaulthomePageRoutingModule {}
