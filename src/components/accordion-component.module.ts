import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccordionComponent } from './accordion/accordion';
import { CaseInfoComponent } from './case-info/case-info';
import { WorkorderInfoComponent } from './workorder-info/workorder-info';
import { WorkorderPartInfoComponent } from './workorder-part-info/workorder-part-info';
import { WorkorderExpenseInfoComponent } from './workorder-expense-info/workorder-expense-info';
import { WorkorderLabourInfoComponent } from './workorder-labour-info/workorder-labour-info';
import { ContactInfoComponent } from './contact-info/contact-info';
import { ServicePlaceInfoComponent } from './service-place-info/service-place-info';
import { PipInfoComponent } from './pip-info/pip-info';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
	declarations: [
        AccordionComponent,
        CaseInfoComponent,
        WorkorderInfoComponent,
        WorkorderPartInfoComponent,
        WorkorderExpenseInfoComponent,
        WorkorderLabourInfoComponent,
        ContactInfoComponent,
        ServicePlaceInfoComponent,
        PipInfoComponent
	],
	entryComponents: [],
	imports: [
        IonicPageModule,
        
        PipesModule
    ],
	exports: [
        AccordionComponent,
        CaseInfoComponent,
        WorkorderInfoComponent,
        WorkorderPartInfoComponent,
        WorkorderExpenseInfoComponent,
        WorkorderLabourInfoComponent,
        ContactInfoComponent,
        ServicePlaceInfoComponent,
        PipInfoComponent
	]
})
export class AccordionComponentModule {}