import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';
import { MapComponent } from './map/map';

@NgModule({
	declarations: [
		AddExpenseComponent,
		MapComponent
	],
	imports: [
		IonicPageModule.forChild(AddExpenseComponent),
		IonicPageModule.forChild(MapComponent)
	],
	exports: [
		AddExpenseComponent,
		MapComponent
	]
})
export class ComponentsModule {}
