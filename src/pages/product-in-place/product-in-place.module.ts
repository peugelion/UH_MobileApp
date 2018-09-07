import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductInPlacePage } from './product-in-place';
import { AccordionComponentModule } from '../../components/accordion-component.module'
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProductInPlacePage
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(ProductInPlacePage),
    PipesModule
  ],
  exports: [ProductInPlacePage]
})
export class ProductInPlacePageModule {}
