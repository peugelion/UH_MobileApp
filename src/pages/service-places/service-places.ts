import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { ServicePlacesServiceProvider } from '../../providers/service-places-service/service-places-service';

/**
 * Generated class for the ServicePlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-places',
  templateUrl: 'service-places.html',
})
export class ServicePlacesPage {

  listLabel: string;
  items: Array<{Id: string, Name: any}>;
  filter: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private spService: ServicePlacesServiceProvider, private oauth : OAuthServiceProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicePlacesPage');

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading, please wait...'
    });
    loading.present();
    this.loadSPs(false)
      .then(r => {
        loading.dismiss();
      });
  }


  loadSPs(filter) {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          this.spService.loadServicePlaces(oauth, filter)   //
            .then(results => {
              console.log(results);
              this.items = results;
              this.listLabel = (filter ? "All" : "Recently Viewed") + " Service Places";
              this.filter = filter;
              resolve(this.items);
            });
        });
      });
  }

  gotoWO(woId) {
    this.navCtrl.push('spDetailsPage', {"woId": woId});
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.loadSPs(this.filter).
      then(r => {
        console.log(" refresher resolve : ", r);
        refresher.complete();
        console.log(" refresher.complete! ");
      })
  }
}
