import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';
import { AccordionComponentModule } from '../../components/accordion-component.module';

@NgModule({
  declarations: [
    ContactPage,
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(ContactPage),
  ],
})
export class ContactPageModule {}
