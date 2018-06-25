import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductInPlacePage } from './product-in-place';
import { WorkorderInfoPageModule } from '../workorder-info/workorder-info.module';

@NgModule({
  declarations: [
    ProductInPlacePage
  ],
  imports: [
    WorkorderInfoPageModule,
    IonicPageModule.forChild(ProductInPlacePage),
  ],
  exports: [ProductInPlacePage]
})
export class ProductInPlacePageModule {}
