import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyactionPage } from './myaction.page';

const routes: Routes = [
  {
    path: '',
    component: MyactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyactionPageRoutingModule {}
