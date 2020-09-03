import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LastreleasePage } from './lastrelease.page';

const routes: Routes = [
  {
    path: '',
    component: LastreleasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LastreleasePageRoutingModule {}
