import { Component, ViewChild } from '@angular/core';
import { Nav, App, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{icon: string, title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public  app: App, public alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'home', title: 'Home', component: HomePage },
      { icon: 'contact', title: 'Contacts', component: 'ContactsPage' },
      { icon: 'briefcase', title: 'Accounts', component: 'AccountsPage' },
      { icon: 'hammer', title: 'Work Orders', component: 'WorkordersPage' },
      { icon: 'build', title: 'Technicians', component: 'TechniciansPage' },
      { icon: 'construct', title: 'Service Places', component: 'ServicePlacesPage' },
      { icon: 'filing', title: 'Stock Inventory', component: 'StockInventoryPage' }
    ];


    platform.registerBackButtonAction(() => {
 
      let appNav = app.getActiveNavs()[0];
      let activeView = appNav.getActive();

      if (appNav.canGoBack()) { //Can we go back?
          appNav.pop();
          return;
      }

      if (activeView.name !== "HomePage") {
        //nav.popToRoot();
        this.nav.setRoot(HomePage);
      } else {
        const alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => console.log(app.getActiveNavs())
            },{
                text: 'Close App',
                handler: () => this.platform.exitApp()  // Close app
            }]
        });
        alert.present();
      }

    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
