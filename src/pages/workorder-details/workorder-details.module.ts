import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkorderDetailsPage } from './workorder-details';

@NgModule({
  declarations: [
    WorkorderDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(WorkorderDetailsPage),
  ],
  exports: [
    WorkorderDetailsPage
  ]
})
export class WorkorderDetailsPageModule {}
