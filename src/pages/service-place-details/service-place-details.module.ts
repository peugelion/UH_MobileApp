import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicePlaceDetailsPage } from './service-place-details';

@NgModule({
  declarations: [
    ServicePlaceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicePlaceDetailsPage),
  ],
})
export class ServicePlaceDetailsPageModule {}
