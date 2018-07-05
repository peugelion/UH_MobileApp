import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TechniciansPage } from '../pages/technicians/technicians';
import { WorkordersPage } from '../pages/workorders/workorders';
import { ContactsPage } from '../pages/contacts/contacts';
import { AccountsPage } from '../pages/accounts/accounts';
import { WorkorderDetailsPageModule } from '../pages/workorder-details/workorder-details.module';
import { ProductInPlacePageModule } from '../pages/product-in-place/product-in-place.module';

import { TechniciansServiceProvider } from '../providers/technicians-service/technicians-service';
import { SobjectServiceProvider } from '../providers/sobject-service/sobject-service';

import { OAuthServiceProvider } from '../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../providers/workorders-service/workorders-service';
import { ServicePlacesServiceProvider } from '../providers/service-places-service/service-places-service';

import { HttpClientModule } from  '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AccordionComponentModule } from '../components/accordion-component.module';
import { RelatedListsDataProvider } from '../providers/related-lists-data/related-lists-data';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    WorkordersPage,
    ContactsPage,
    AccountsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    WorkorderDetailsPageModule,
    ReactiveFormsModule,
    ComponentsModule,
    ProductInPlacePageModule,
    AccordionComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    WorkordersPage,
    ContactsPage,
    AccountsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TechniciansServiceProvider,
    SobjectServiceProvider,
    OAuthServiceProvider,
    WorkordersServiceProvider,
    ServicePlacesServiceProvider,
    RelatedListsDataProvider,
  ]
})
export class AppModule {}
