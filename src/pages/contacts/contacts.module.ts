import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactsPage } from './contacts';
import { AccordionComponentModule } from '../../components/accordion-component.module';

@NgModule({
  declarations: [
    ContactsPage
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(ContactsPage),
  ],
})
export class ContactsPageModule {}
