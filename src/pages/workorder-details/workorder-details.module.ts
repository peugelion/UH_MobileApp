import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkorderDetailsPage } from './workorder-details';
import { WorkorderFooterActionsPage } from '../workorder-footer-actions/workorder-footer-actions';

@NgModule({
  declarations: [
    WorkorderDetailsPage,
    WorkorderFooterActionsPage
  ],
  imports: [
    IonicPageModule.forChild(WorkorderDetailsPage),
  ],
  exports: [
    WorkorderDetailsPage
  ]
})
export class WorkorderDetailsPageModule {}
