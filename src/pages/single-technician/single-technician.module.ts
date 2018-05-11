import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TechniciansPage } from '../technicians/technicians';
import { SingleTechnicianPage } from './single-technician';

@NgModule({
  declarations: [
    SingleTechnicianPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleTechnicianPage),
  ],
  //exports: [ TechniciansPage ]
})
export class SingleTechnicianPageModule {}
