import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccordionComponent } from './accordion/accordion';
import { CaseInfoComponent } from './case-info/case-info';
import { WorkorderInfoComponent } from './workorder-info/workorder-info';
import { WorkorderPartInfoComponent } from './workorder-part-info/workorder-part-info';
import { WorkorderExpenseInfoComponent } from './workorder-expense-info/workorder-expense-info';
import { WorkorderLabourInfoComponent } from './workorder-labour-info/workorder-labour-info';

@NgModule({
	declarations: [
    AccordionComponent,
    CaseInfoComponent,
    WorkorderInfoComponent,
    WorkorderPartInfoComponent,
    WorkorderExpenseInfoComponent,
    WorkorderLabourInfoComponent
	],
	entryComponents: [],
	imports: [IonicPageModule],
	exports: [
    AccordionComponent,
    CaseInfoComponent,
    WorkorderInfoComponent,
    WorkorderPartInfoComponent,
    WorkorderExpenseInfoComponent,
    WorkorderLabourInfoComponent
	]
})
export class AccordionComponentModule {}