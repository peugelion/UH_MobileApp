import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { MapComponent } from './map/map';
import { DeptInventoryComponent } from './dept-inventory/dept-inventory';
import { RelatedTabComponent } from './related-tab/related-tab';

@NgModule({
	declarations: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent
	],
	entryComponents: [AddExpenseComponent, DeptInventoryComponent],
	imports: [IonicPageModule],
	exports: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent
	]
})
export class ComponentsModule {}