import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { MapComponent } from './map/map';
import { DeptInventoryComponent } from './dept-inventory/dept-inventory';
import { RelatedTabComponent } from './related-tab/related-tab';
import { WorkorderFormComponent } from './workorder-form/workorder-form';
import { AddLaborComponent } from './add-labor/add-labor';

@NgModule({
	declarations: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent,
    WorkorderFormComponent,
    AddLaborComponent
	],
	entryComponents: [
    AddExpenseComponent,
    DeptInventoryComponent,
    WorkorderFormComponent,
    AddLaborComponent
  ],
	imports: [IonicPageModule],
	exports: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent,
    WorkorderFormComponent,
    AddLaborComponent
	]
})
export class ComponentsModule {}