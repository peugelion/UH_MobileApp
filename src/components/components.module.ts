import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { MapComponent } from './map/map';
import { DeptInventoryComponent } from './dept-inventory/dept-inventory';

@NgModule({
	declarations: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent
	],
	entryComponents: [AddExpenseComponent, DeptInventoryComponent],
	imports: [IonicPageModule],
	exports: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent
	]
})
export class ComponentsModule {}