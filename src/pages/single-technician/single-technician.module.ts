import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleTechnicianPage } from './single-technician';

@NgModule({
  declarations: [
    SingleTechnicianPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleTechnicianPage),
  ],
  // exports: [
  //   SingleTechnicianPage
  // ]
})
export class SingleTechnicianPageModule {}
