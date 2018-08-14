import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { MapComponent } from './map/map';
import { DeptInventoryComponent } from './dept-inventory/dept-inventory';
import { RelatedTabComponent } from './related-tab/related-tab';
import { WorkorderFormComponent } from './workorder-form/workorder-form';
import { AddLaborComponent } from './add-labor/add-labor';
import { RejectWorkorderComponent } from './reject-workorder/reject-workorder';
import { EditWorkorderComponent } from './edit-workorder/edit-workorder';
import { AddPartComponent } from './add-part/add-part';

@NgModule({
	declarations: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent,
    WorkorderFormComponent,
    AddLaborComponent,
    RejectWorkorderComponent,
    EditWorkorderComponent,
    AddPartComponent
	],
	entryComponents: [
    AddExpenseComponent,
    DeptInventoryComponent,
    WorkorderFormComponent,
    AddLaborComponent,
    AddPartComponent,
    RejectWorkorderComponent,
    EditWorkorderComponent
  ],
	imports: [IonicPageModule],
	exports: [
		AddExpenseComponent,
		DeptInventoryComponent,
		MapComponent,
    RelatedTabComponent,
    WorkorderFormComponent,
    AddLaborComponent,
    RejectWorkorderComponent,
    EditWorkorderComponent,
    AddPartComponent
	]
})
export class ComponentsModule {}