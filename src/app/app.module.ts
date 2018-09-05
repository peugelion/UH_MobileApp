import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common'; // jezik
//import locale from '@angular/common/locales/en-US-POSIX';      // jezik za datume/currency
import locale from '@angular/common/locales/sr-Cyrl';      // jezik za datume/currency
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
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
import { MapServiceProvider } from '../providers/map-service/map-service';
import { AccordionComponentModule } from '../components/accordion-component.module';
import { RelatedListsDataProvider } from '../providers/related-lists-data/related-lists-data';
import { IonicStorageModule } from '@ionic/storage';

import { PipesModule } from '../pipes/pipes.module';


registerLocaleData(locale);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'arrow-dropleft'
    }),
    WorkorderDetailsPageModule,
    ReactiveFormsModule,
    ComponentsModule,
    ProductInPlacePageModule,
    AccordionComponentModule,
    IonicStorageModule.forRoot(),

    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "en-US" }, //replace "en-US" with your locale
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TechniciansServiceProvider,
    SobjectServiceProvider,
    OAuthServiceProvider,
    WorkordersServiceProvider,
    ServicePlacesServiceProvider,
    MapServiceProvider,
    RelatedListsDataProvider
  ]
})
export class AppModule {}