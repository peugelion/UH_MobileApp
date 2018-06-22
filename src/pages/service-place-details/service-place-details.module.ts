import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicePlaceDetailsPage } from './service-place-details';

//import { MapComponent } from '../../components/map/map';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ServicePlaceDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(ServicePlaceDetailsPage),
    ComponentsModule
  ],
})
export class ServicePlaceDetailsPageModule {}
