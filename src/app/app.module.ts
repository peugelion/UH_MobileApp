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
import { WorkorderDetailsPageModule } from '../pages/workorder-details/workorder-details.module';
import { ServicePlacesPage } from '../pages/service-places/service-places';

import { TechniciansServiceProvider } from '../providers/technicians-service/technicians-service';
import { SobjectServiceProvider } from '../providers/sobject-service/sobject-service';

import { OAuthServiceProvider } from '../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../providers/workorders-service/workorders-service';
import { ServicePlacesServiceProvider } from '../providers/service-places-service/service-places-service';

import { HttpClientModule } from  '@angular/common/http';

// import { Geolocation } from '@ionic-native/geolocation';

import { WorkorderInfoPage } from '../pages/workorder-info/workorder-info';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TechniciansPage,
    WorkordersPage,
    ServicePlacesPage,
    WorkorderInfoPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    WorkorderDetailsPageModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TechniciansPage,
    WorkordersPage,
    ServicePlacesPage
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
  ]
})
export class AppModule {}
