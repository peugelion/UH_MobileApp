import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TechniciansPage } from './technicians';

@NgModule({
  declarations: [
    TechniciansPage,
  ],
  imports: [
    IonicPageModule.forChild(TechniciansPage),
  ],
})
export class TechniciansPageModule {}
