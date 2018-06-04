import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartmentDetailsPage } from './department-details';

@NgModule({
  declarations: [
    DepartmentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DepartmentDetailsPage),
  ],
})
export class DepartmentDetailsPageModule {}
