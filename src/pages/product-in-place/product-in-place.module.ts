import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductInPlacePage } from './product-in-place';

@NgModule({
  declarations: [
    ProductInPlacePage,
  ],
  imports: [
    IonicPageModule.forChild(ProductInPlacePage),
  ],
  exports: [ProductInPlacePage]
})
export class ProductInPlacePageModule {}
