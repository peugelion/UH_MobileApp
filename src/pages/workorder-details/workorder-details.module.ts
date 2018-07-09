import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkorderDetailsPage } from './workorder-details';
import { WorkorderFooterActionsPage } from '../workorder-footer-actions/workorder-footer-actions';
import { ComponentsModule } from '../../components/components.module';
import { AccordionComponentModule } from '../../components/accordion-component.module';

@NgModule({
  declarations: [
    WorkorderDetailsPage,
    WorkorderFooterActionsPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(WorkorderDetailsPage),
    AccordionComponentModule
  ],
  exports: [
    WorkorderDetailsPage
  ]
})
export class WorkorderDetailsPageModule {}
