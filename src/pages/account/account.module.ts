import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { AccordionComponentModule } from '../../components/accordion-component.module';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(AccountPage),
  ],
})
export class AccountPageModule {}
