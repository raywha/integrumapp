import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';
import { TranslateModule } from '@ngx-translate/core';
import { TabsPage } from './tabs.page';
import { PopoverComponent } from '../tab1/component/popover/popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    TranslateModule
  ],
  declarations: [TabsPage,PopoverComponent],
  entryComponents:[PopoverComponent]
})
export class TabsPageModule {}
