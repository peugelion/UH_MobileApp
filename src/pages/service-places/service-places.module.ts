import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicePlacesPage } from './service-places';

@NgModule({
  declarations: [
    ServicePlacesPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicePlacesPage),
  ],
})
export class ServicePlacesPageModule {}
