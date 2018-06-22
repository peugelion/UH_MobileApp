import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { DeptInventoryComponent } from './dept-inventory/dept-inventory';

@NgModule({
	declarations: [AddExpenseComponent, DeptInventoryComponent],
  entryComponents: [AddExpenseComponent, DeptInventoryComponent],
  imports: [IonicPageModule],
	exports: [AddExpenseComponent, DeptInventoryComponent]
})
export class ComponentsModule {}