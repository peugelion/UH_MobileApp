import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { MapComponent } from './map/map';
import { DeptInventoryComponent } from './dept-inventory/dept-inventory';
import { RelatedTabComponent } from './related-tab/related-tab';
import { WorkorderFormComponent } from './workorder-form/workorder-form';

@NgModule({
	declarations: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent,
    WorkorderFormComponent
	],
	entryComponents: [AddExpenseComponent, DeptInventoryComponent, WorkorderFormComponent],
	imports: [IonicPageModule],
	exports: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent,
    WorkorderFormComponent
	]
})
export class ComponentsModule {}