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

import { TechniciansServiceProvider } from '../providers/technicians-service/technicians-service';
import { OAuthServiceProvider } from '../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../providers/workorders-service/workorders-service';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TechniciansPage,
    WorkordersPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TechniciansPage,
    WorkordersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TechniciansServiceProvider,
    OAuthServiceProvider,
    WorkordersServiceProvider
  ]
})
export class AppModule {}
