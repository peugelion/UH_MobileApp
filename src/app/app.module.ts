import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TechniciansPage } from '../pages/technicians/technicians';
import { TechniciansServiceProvider } from '../providers/technicians-service/technicians-service';
import { OAuthServiceProvider } from '../providers/o-auth-service/o-auth-service';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TechniciansPage
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TechniciansPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TechniciansServiceProvider,
    OAuthServiceProvider
  ]
})
export class AppModule {}
