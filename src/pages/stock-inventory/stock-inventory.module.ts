import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockInventoryPage } from './stock-inventory';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    StockInventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StockInventoryPage),
    ComponentsModule
  ],
})
export class StockInventoryPageModule {}
