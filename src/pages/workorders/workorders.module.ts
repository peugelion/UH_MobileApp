import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkordersPage } from './workorders';
import { AccordionComponentModule } from '../../components/accordion-component.module';

@NgModule({
  declarations: [
    WorkordersPage
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(WorkordersPage),
  ],
})
export class WorkordersPageModule {}
