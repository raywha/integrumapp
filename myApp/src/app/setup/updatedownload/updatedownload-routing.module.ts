import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatedownloadPage } from './updatedownload.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatedownloadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatedownloadPageRoutingModule {}
