import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleTechnicianPage } from './single-technician';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SingleTechnicianPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleTechnicianPage),
    ComponentsModule
  ],
  // exports: [
  //   SingleTechnicianPage
  // ]
})
export class SingleTechnicianPageModule {}
