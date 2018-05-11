import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TechniciansPage } from './technicians';
import { SingleTechnicianPage } from '../single-technician/single-technician';

@NgModule({
  declarations: [
    TechniciansPage,
    SingleTechnicianPage
  ],
  imports: [
    IonicPageModule.forChild(TechniciansPage),
    IonicPageModule.forChild(SingleTechnicianPage),
  ],
})
export class TechniciansPageModule {}
