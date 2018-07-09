import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductInPlacePage } from './product-in-place';
import { AccordionComponentModule } from '../../components/accordion-component.module'

@NgModule({
  declarations: [
    ProductInPlacePage
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(ProductInPlacePage),
  ],
  exports: [ProductInPlacePage]
})
export class ProductInPlacePageModule {}
