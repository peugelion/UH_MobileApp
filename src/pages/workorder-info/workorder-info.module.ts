import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkorderInfoPage } from './workorder-info';

@NgModule({
  declarations: [WorkorderInfoPage],
  imports: [
    IonicPageModule.forChild(WorkorderInfoPage),
  ],
  exports: [WorkorderInfoPage]
})
export class WorkorderInfoPageModule {}
