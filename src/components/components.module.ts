import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExpenseComponent } from './add-expense/add-expense';

@NgModule({
	declarations: [AddExpenseComponent],
	imports: [IonicPageModule.forChild(AddExpenseComponent)],
	exports: [AddExpenseComponent]
})
export class ComponentsModule {}
