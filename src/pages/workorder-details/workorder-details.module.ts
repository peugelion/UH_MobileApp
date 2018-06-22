import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkorderDetailsPage } from './workorder-details';
import { WorkorderFooterActionsPage } from '../workorder-footer-actions/workorder-footer-actions';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WorkorderDetailsPage,
    WorkorderFooterActionsPage
  ],
  imports: [
    IonicPageModule.forChild(WorkorderDetailsPage),
    ComponentsModule
  ],
  exports: [
    WorkorderDetailsPage
  ]
})
export class WorkorderDetailsPageModule {}
